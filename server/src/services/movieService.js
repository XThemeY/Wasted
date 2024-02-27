import { Movie, Genre } from '../database/models/index.js';
import ApiError from '../utils/apiError.js';
import { MovieDto, MovieShortDto, newMediaDto } from '../dtos/index.js';

class MovieService {
  async getMovie(id) {
    const movie = await Movie.findOne(
      { id },
      '-genres._id -genres.__v -director._id -cast._id',
    )
      .populate({
        path: 'countries tags director.person cast.person production_companies user_raitings comments',
        select: '-createdAt -updatedAt -_id -__v -movies -shows',
      })
      .exec();

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
        .exec();
      resolve(count);
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
        .sort([sort_by])
        .skip(page * limit)
        .limit(limit)
        .exec();
      resolve(data);
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
      return new newMediaDto(movie);
    });
    newMovies.page = page + 1;
    newMovies.total_pages = total_pages;
    newMovies.total_items = total_items;

    return newMovies;
  }
}

// убрать просмотренные, по количеству просмотров.

export default new MovieService();
