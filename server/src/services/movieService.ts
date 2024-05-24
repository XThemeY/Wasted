import type { IMovieModel } from '#interfaces/IModel';
import type { RatingTuple, UserRating, UserReaction } from '#types/types';
import type { IReactions } from '#interfaces/IFields';
import type {
  IErrMsg,
  ISearchResult,
  IMovieUpdate,
  ISearchQuery,
} from '#interfaces/IApp';
import {
  Movie,
  UserRatings,
  UserReactions,
  WastedHistory,
} from '#db/models/index.js';
import { MovieShort } from '#utils/dtos/index.js';
import ApiError from '#utils/apiError.js';
import { moviePopFields } from '#config/index.js';

class MovieService {
  async getMovie(id: number): Promise<IMovieModel> {
    const movie = await Movie.findOne({ id }).populate(moviePopFields).exec();
    if (!movie) throw ApiError.BadRequest(`Фильм с id:${id} не найден`);
    return movie;
  }

  async updateMovie(id: number, options: IMovieUpdate): Promise<IMovieModel> {
    const movie = await Movie.findOneAndUpdate(
      { id },
      { ...options },
      { new: true, runValidators: true },
    )
      .populate(moviePopFields)
      .exec();
    if (!movie) throw ApiError.BadRequest(`Фильм с id:${id} не найден`);
    return movie;
  }

  async exploreMovies({
    page,
    limit,
    sort_by,
    title,
    start_year,
    end_year,
    start_year_default,
    end_year_default,
    genres,
    countries,
    wastedIds,
  }: ISearchQuery): Promise<ISearchResult | IErrMsg> {
    const newMovies: ISearchResult = {
      items: [],
      page,
      total_pages: 0,
      total_items: 0,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseQuery: any = {
      $or: [
        { title: { $regex: title, $options: 'i' } },
        { title_original: { $regex: title, $options: 'i' } },
      ],
      genres: { $in: genres },
      countries: { $in: countries },

      id: { $nin: wastedIds },
    };

    if (start_year !== undefined && end_year !== undefined) {
      baseQuery.release_date = {
        $gte: start_year,
        $lte: end_year,
      };
    } else if (start_year !== undefined) {
      baseQuery.release_date = {
        $gte: start_year,
        $lte: end_year_default,
      };
    } else if (end_year !== undefined) {
      baseQuery.release_date = {
        $gte: start_year_default,
        $lte: end_year,
      };
    } else {
      baseQuery.$or.push(
        {
          release_date: {
            $gte: start_year_default,
            $lte: end_year_default,
          },
        },
        { release_date: null },
      );
    }

    try {
      const [total_items, total_movies] = await Promise.all([
        Movie.countDocuments(baseQuery),
        Movie.find(baseQuery)
          .sort([[sort_by[0], sort_by[1]]])
          .skip(page * limit)
          .limit(limit)
          .populate(moviePopFields)
          .exec(),
      ]);

      const total_pages = Math.ceil(total_items / limit);

      if (page + 1 > total_pages && total_pages !== 0) {
        return { message: 'Invalid page' };
      }
      if (!total_movies.length) {
        return { message: `Movies not found` };
      }
      newMovies.items = total_movies.map((movie) => {
        return new MovieShort(movie);
      });
      newMovies.page = page + 1;
      newMovies.total_pages = total_pages;
      newMovies.total_items = total_items;
      return newMovies;
    } catch (error) {
      return { message: error.message || 'Internal Server Error' };
    }
  }

  async setRating(
    username: string,
    itemId: number,
    ratingTuple: RatingTuple,
  ): Promise<UserRating> {
    const movie = await Movie.findOne(
      {
        id: itemId,
      },
      'ratings.wasted',
    ).exec();
    if (!movie) {
      throw ApiError.BadRequest(`Фильма с id:${itemId} не существует`);
    }
    const isRated = await UserRatings.findOne(
      {
        username,
        'movies.itemId': itemId,
      },
      { 'movies.$': itemId },
    );

    const [ratingName, ratingValue] = ratingTuple;

    //Add rating
    if (!isRated) {
      await UserRatings.updateOne(
        {
          username,
        },
        {
          $push: {
            movies: [{ itemId, rating: ratingValue, ratingName }],
          },
        },
        { upsert: true, runValidators: true },
      );

      movie.ratings.wasted[ratingName] += ratingValue;
      movie.ratings.wasted.vote_count += 1;
      await movie.save();
      return { movieId: itemId, rating: movie.ratings.wasted };
    }

    //Delete rating
    if (ratingValue === isRated.movies[0].rating) {
      await UserRatings.updateOne(
        {
          username,
          'movies.itemId': itemId,
        },
        {
          $pull: { movies: { itemId } },
        },
      );
      movie.ratings.wasted[ratingName] -= ratingValue;
      movie.ratings.wasted.vote_count -= 1;
      await movie.save();
      return { movieId: itemId, rating: movie.ratings.wasted };
    }

    //Update rating
    await UserRatings.updateOne(
      {
        username,
        'movies.itemId': itemId,
      },
      {
        $set: {
          'movies.$': {
            itemId,
            rating: ratingValue,
            ratingName: ratingName,
          },
        },
      },
      { runValidators: true },
    );
    movie.ratings.wasted[ratingName] += ratingValue;
    movie.ratings.wasted[isRated.movies[0].ratingName] -=
      isRated.movies[0].rating;
    await movie.save();
    return { movieId: itemId, rating: movie.ratings.wasted };
  }

  async setTotalRating(id: number): Promise<number> {
    const movie = await Movie.findOne({ id }, 'rating ratings.wasted').exec();
    const ratingArr = Object.values(movie.ratings.wasted)
      .slice(0, -1)
      .filter((el) => el !== 0);

    if (!ratingArr.length) {
      movie.rating = 0;
      await movie.save();
      return movie.rating;
    }
    const rating =
      ratingArr.reduce((sum, value) => sum + value, 0) /
      movie.ratings.wasted.vote_count;
    movie.rating = rating % 1 === 0 ? rating : +rating.toFixed(2);
    await movie.save();
    return movie.rating;
  }

  async setMovieReactions(
    username: string,
    itemId: number,
    reactions: string[],
  ): Promise<UserReaction> {
    const movie = await Movie.findOne(
      {
        id: itemId,
      },
      'reactions',
    ).exec();
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
      await UserReactions.findOneAndUpdate(
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
      return { movieId: itemId, reactions };
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
    return { movieId: itemId, reactions };
  }

  async setTotalReactions(id: number): Promise<IReactions> {
    const movie = await Movie.findOne({ id }, 'reactions').exec();
    let total_votes = 0;
    const reactions = Object.keys(movie.reactions);

    reactions.forEach((key) => {
      total_votes += movie.reactions[key].vote_count;
    });

    if (!total_votes) {
      reactions.forEach((key) => {
        movie.reactions[key].value = 0;
      });
      await movie.save();
      return movie.reactions;
    }
    reactions.forEach((key) => {
      movie.reactions[key].value = +(
        (100 * movie.reactions[key].vote_count) /
        total_votes
      ).toFixed(0);
    });
    await movie.save();
    return movie.reactions;
  }

  async setWatchCount(id: number): Promise<number> {
    const watch_count = await WastedHistory.countDocuments({
      movies: {
        $elemMatch: {
          itemId: id,
          status: { $in: ['watched'] },
        },
      },
    });
    await Movie.updateOne({ id }, { $set: { watch_count } }).exec();
    return watch_count;
  }
}

export default new MovieService();
