import { Movie } from '../database/models/index.js';
import ApiError from '../utils/apiError.js';
import { MovieDto, MovieShortDto } from '../dtos/movieDto.js';
class MovieService {
  async getMovie(id) {
    const movie = await Movie.findOne({ id })
      .populate({
        path: 'genres countries tags director.person cast.person production_companies user_raitings comments',
        select: '-createdAt -updatedAt -_id -__v -movies -shows',
      })
      .exec();

    if (!movie) {
      throw ApiError.BadRequest(`Фильма с таким id:${id} не существует`);
    }
    const movieDto = new MovieDto(movie);
    return movieDto;
  }

  async getMovieAll() {
    const movies = await Movie.find({})
      .populate({
        path: 'genres countries director.person cast.person production_companies',
        select: '-createdAt -updatedAt -_id -__v -movies -shows',
      })
      .exec();
    if (!movies) {
      throw ApiError.BadRequest(`Фильмы не найдены`);
    }
    const newMovies = movies.map((movie) => {
      return new MovieShortDto(movie);
    });
    const totalCount = await Movie.countDocuments();
    const response = { items: newMovies, total_items: totalCount };
    return response;
  }

  async searchMovie(title) {
    const movies = await Movie.find({
      $or: [
        { title: { $regex: title, $options: 'i' } },
        { title_original: { $regex: title, $options: 'i' } },
      ],
    }).sort();

    if (!movies) {
      throw ApiError.BadRequest(`Фильмы не найдены`);
    }
    const newMovies = movies.map((movie) => {
      return new MovieShortDto(movie);
    });
    const totalCount = newMovies.length;
    const response = { items: newMovies, total_items: totalCount };
    return response;
  }
}

//Поиск по названию, по оригинальному названию, фильтрация по году выхода, по стране, по жанру, убрать просмотренные, по количеству просмотров. Сортировка по популярности, по рейтингу, по алфавиту

export default new MovieService();
