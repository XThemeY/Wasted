import {
  Movie,
  UserRating,
  UserReactions,
  WastedHistory,
} from '#db/models/index.js';
import { MovieDto, NewMediaDto } from '#dtos/index.js';
import ApiError from '#utils/apiError.js';

class MovieService {
  async getMovie(id) {
    const movie = await Movie.findOne(
      { id },
      '-genres._id -genres.__v -director._id -cast._id',
    )
      .populate({
        path: 'countries tags director.person cast.person production_companies comments',
        select: '-createdAt -updatedAt -_id -__v -movies -shows',
      })
      .exec();

    if (!movie) {
      throw ApiError.BadRequest(`Фильма с таким id:${id} не существует`);
    }
    const movieDto = new MovieDto(movie);
    return movieDto;
  }

  async updateMovie(id, options) {
    const movie = await Movie.findOneAndUpdate(
      { id },
      { ...options },
      { new: true },
    ).exec();

    if (!movie) {
      throw ApiError.BadRequest(`Фильма с таким id:${id} не существует`);
    }
    const movieDto = new MovieDto(movie);
    return movieDto;
  }

  async exploreMovies({
    page,
    limit,
    sort_by,
    title,
    start_year,
    end_year,
    genres,
    countries,
    wastedIds,
  }) {
    const newMovies = { items: [], page, total_pages: 0, total_items: 0 };

    const countQuery = new Promise(function (resolve, reject) {
      const count = Movie.countDocuments({
        $or: [
          { title: { $regex: title, $options: 'i' } },
          { title_original: { $regex: title, $options: 'i' } },
        ],
      })
        .where('release_date')
        .gte(start_year)
        .lte(end_year)
        .where('genres')
        .in(genres)
        .where('countries')
        .in(countries)
        .nin('id', wastedIds)
        .exec();
      resolve(count);
      reject(ApiError.InternalServerError());
    });

    const dataQuery = new Promise(function (resolve, reject) {
      const data = Movie.find({
        $or: [
          { title: { $regex: title, $options: 'i' } },
          { title_original: { $regex: title, $options: 'i' } },
        ],
      })
        .populate('countriesId genresId')
        .where('release_date')
        .gte(start_year)
        .lte(end_year)
        .where('genres')
        .in(genres)
        .where('countries')
        .in(countries)
        .nin('id', wastedIds)
        .sort([sort_by])
        .skip(page * limit)
        .limit(limit)
        .exec();
      resolve(data);
      reject(ApiError.InternalServerError());
    });
    const results = await Promise.all([countQuery, dataQuery]);

    const total_movies = results[1];
    const total_items = results[0];
    const total_pages = Math.ceil(total_items / limit);

    if (page + 1 > total_pages && total_pages !== 0) {
      return { message: 'Invalid page' };
    }
    if (!total_movies.length) {
      return { message: `Фильмы не найдены` };
    }
    newMovies.items = total_movies.map((movie) => {
      return new NewMediaDto(movie);
    });
    newMovies.page = page + 1;
    newMovies.total_pages = total_pages;
    newMovies.total_items = total_items;
    return newMovies;
  }

  async setWatchCount(id) {
    const movie = await Movie.findOne(
      {
        id,
      },
      'watch_count',
    ).exec();
    if (!movie) {
      throw ApiError.BadRequest(`Фильма с таким id:${id} не существует`);
    }
    movie.watch_count = await WastedHistory.find({
      'movies.itemId': id,
      'movies.status': 'watched',
    })
      .count()
      .exec();

    await movie.save();
  }

  async setRating(username, itemId, ratingTuple) {
    const movie = await Movie.findOne({
      id: itemId,
    }).exec();
    if (!movie) {
      throw ApiError.BadRequest(`Фильма с таким id:${itemId} не существует`);
    }
    const isRated = await UserRating.findOne(
      {
        username,
        'movies.itemId': itemId,
      },
      { 'movies.$': itemId },
    );
    if (!isRated) {
      await UserRating.updateOne(
        {
          username,
        },
        {
          $push: {
            movies: [
              { itemId, rating: ratingTuple[1], ratingName: ratingTuple[0] },
            ],
          },
        },
        { upsert: true, runValidators: true },
      );

      movie.ratings.wasted[ratingTuple[0]] =
        movie.ratings.wasted[ratingTuple[0]] + ratingTuple[1];
      movie.ratings.wasted.vote_count += 1;
      await movie.save();
      await this.setTotalRating(itemId);
      return {
        status: 'added',
        message: `Фильму с id:${itemId} поставлен рейтинг ${ratingTuple[1]}`,
      };
    }
    if (ratingTuple[1] === isRated.movies[0].rating) {
      await UserRating.updateOne(
        {
          username,
          'movies.itemId': itemId,
        },
        {
          $pull: { movies: { itemId } },
        },
      );
      movie.ratings.wasted[ratingTuple[0]] =
        movie.ratings.wasted[ratingTuple[0]] - ratingTuple[1];
      movie.ratings.wasted.vote_count -= 1;
      await movie.save();
      await this.setTotalRating(itemId);
      return {
        status: 'del',
        message: `Фильму с id:${itemId} удален рейтинг`,
      };
    }
    await UserRating.updateOne(
      {
        username,
        'movies.itemId': itemId,
      },
      {
        $set: {
          'movies.$': {
            itemId,
            rating: ratingTuple[1],
            ratingName: ratingTuple[0],
          },
        },
      },
      { runValidators: true },
    );
    movie.ratings.wasted[ratingTuple[0]] =
      movie.ratings.wasted[ratingTuple[0]] + ratingTuple[1];
    movie.ratings.wasted[isRated.movies[0].ratingName] =
      movie.ratings.wasted[isRated.movies[0].ratingName] -
      isRated.movies[0].rating;
    await movie.save();
    await this.setTotalRating(itemId);
    return {
      status: 'changed',
      message: `Фильму с id:${itemId} изменен рейтинг на ${ratingTuple[1]}`,
    };
  }

  async setTotalRating(id) {
    const movie = await Movie.findOne({ id }, 'rating ratings.wasted');
    const ratingArr = Object.values(movie.ratings.wasted)
      .slice(0, -1)
      .filter((el) => el !== 0);
    if (!ratingArr.length) {
      movie.rating = 0;
      await movie.save();
      return;
    }
    const rating =
      ratingArr.reduce((sum, value) => sum + value) /
      movie.ratings.wasted.vote_count;
    movie.rating = rating % 1 === 0 ? rating : rating.toFixed(2);
    await movie.save();
  }

  async setMovieReactions(username, itemId, reactions) {
    const movie = await Movie.findOne({
      id: itemId,
    }).exec();
    if (!movie) {
      throw ApiError.BadRequest(`Фильма с таким id:${itemId} не существует`);
    }
    const isReacted = await UserReactions.findOne(
      {
        username,
        'movies.itemId': itemId,
      },
      { 'movies.$': itemId },
    );
    if (!isReacted) {
      await UserReactions.updateOne(
        {
          username,
        },
        {
          $push: {
            movies: [{ itemId, reactions }],
          },
        },
        { upsert: true, runValidators: true },
      );

      reactions.forEach((el) => {
        movie.reactions[el].vote_count += 1;
      });

      await movie.save();
      await this.setTotalReactions(itemId);
      return {
        status: 'added',
        message: `Фильму с id:${itemId} поставлены реакции: ${reactions}`,
      };
    }

    isReacted.movies[0].reactions.forEach((el) => {
      movie.reactions[el].vote_count -= 1;
    });
    await UserReactions.updateOne(
      {
        username,
        'movies.itemId': itemId,
      },
      {
        $set: {
          'movies.$': {
            itemId,
            reactions,
          },
        },
      },
      { runValidators: true },
    );
    reactions.forEach((el) => {
      movie.reactions[el].vote_count += 1;
    });
    await movie.save();
    await this.setTotalReactions(itemId);
    return {
      status: 'changed',
      message: `Фильму с id:${itemId} изменены реакции на ${reactions}`,
    };
  }

  async setTotalReactions(id) {
    const movie = await Movie.findOne({ id }, 'reactions');
    let total_votes = 0;
    Object.keys(movie.reactions).forEach((key) => {
      total_votes = total_votes + movie.reactions[key].vote_count;
    });
    Object.keys(movie.reactions).forEach((key) => {
      movie.reactions[key].value = (
        (100 * movie.reactions[key].vote_count) /
        total_votes
      ).toFixed(0);
    });
    await movie.save();
  }
}

export default new MovieService();
