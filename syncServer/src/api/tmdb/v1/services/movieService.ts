import { Movie } from '#db/models/index.js';
import {
  getMediaImages,
  getGenres,
  getCountries,
  getPeoples,
  getTags,
  getProdCompanies,
} from '#/utils/dbFields.js';
import { IMediaModel, IMovie } from '#/interfaces/IModel';
import { logger } from '#/middleware/logger';
import { logNames } from '#/config/index';

const movieLogger = logger(logNames.movie);

class MovieService {
  async getMovie(id: number): Promise<IMovie | null> {
    const movie = await Movie.findOne({ 'external_ids.tmdb': id });
    if (!movie) {
      movieLogger.info(
        `ACTION: Фильма c tmdbID:${movie.external_ids.tmdb} не существует в базе данных`,
      );
      return null;
    }
    movieLogger.info(
      `ACTION: Фильм c tmdbID:${movie.external_ids.tmdb} уже существует в базе данных под id:${movie.id} - Title: ${movie.title}. `,
    );
    return movie;
  }

  async syncMovie(
    model: IMediaModel,
    modelENG?: IMediaModel,
    latestTMDBId?: number,
  ): Promise<void> {
    const movie = await Movie.findOne({ 'external_ids.tmdb': model.id });
    if (!movie) {
      movieLogger.info(
        `ACTION: Фильм c tmdbID:${movie.external_ids.tmdb} не существует в базе данных`,
      );
      return;
    }
    await Movie.findOneAndUpdate(
      { 'external_ids.tmdb': model.id },
      {
        title: model.title,
        title_original: model.original_title,
        release_date: model.release_date,
        description: model.overview,
        description_original: modelENG.overview,
        duration: model.runtime,
        rating: model.vote_average,
        ratings: {
          tmdb: {
            rating: model.vote_average,
            vote_count: model.vote_count,
          },
          //imdb: { type: Number, default: 0 },
          //kinopoisk: { type: Number, default: 0 },
        },
        external_ids: {
          tmdb: model.id,
          imdb: model.imdb_id,
          //kinopoisk: { type: String },
        },
        popularity: model.popularity,
        images: await getMediaImages(movie.id, 'movie', model),
        genres: await getGenres(model.genres, modelENG.genres),
        countries: await getCountries(model.production_countries),
        director: await getPeoples(
          model.credits,
          'director',
          movie.id,
          'movie',
        ),
        cast: await getPeoples(model.credits, 'actor', movie.id, 'movie'),
        tags: await getTags(model.keywords.keywords),
        production_companies: await getProdCompanies(
          model.production_companies,
        ),
      },
    );

    movieLogger.info(
      `ACTION: Фильм c tmdbID:${movie.external_ids.tmdb} из ${latestTMDBId} был добавлен в базу под id:${movie.id}.`,
    );
  }

  async addMovieToDb(
    model: IMediaModel,
    modelENG?: IMediaModel,
    latestTMDBId?: number,
  ): Promise<void> {
    const oldMovie = await Movie.findOne({ 'external_ids.tmdb': model.id });
    if (!oldMovie) {
      const movie = await Movie.create({
        title: model.title,
        title_original: model.original_title,
        release_date: model.release_date,
        description: model.overview,
        description_original: modelENG.overview,
        duration: model.runtime,
        rating: model.vote_average,
        ratings: {
          tmdb: {
            rating: model.vote_average,
            vote_count: model.vote_count,
          },
          //imdb: { type: Number, default: 0 },
          //kinopoisk: { type: Number, default: 0 },
        },
        external_ids: {
          tmdb: model.id,
          imdb: model.imdb_id,
          //kinopoisk: { type: String },
        },
        popularity: model.popularity,
      });

      movie.images = await getMediaImages(movie.id, 'movie', model);
      movie.genres = await getGenres(model.genres, modelENG.genres);
      movie.countries = await getCountries(model.production_countries);
      movie.director = await getPeoples(
        model.credits,
        'director',
        movie.id,
        'movie',
      );
      movie.cast = await getPeoples(model.credits, 'actor', movie.id, 'movie');
      movie.tags = await getTags(model.keywords.keywords);
      movie.production_companies = await getProdCompanies(
        model.production_companies,
      );
      await movie.save();
      movieLogger.info(
        `ACTION: Фильм c tmdbID:${movie.external_ids.tmdb} из ${latestTMDBId} был добавлен в базу под id:${movie.id}.`,
      );
      return;
    }
    movieLogger.info(
      `ACTION: Фильм c tmdbID:${oldMovie.external_ids.tmdb} уже существует под id:${oldMovie.id}.`,
    );
  }

  async syncRatings(model: IMediaModel): Promise<void> {
    const movie = await Movie.findOne({ 'external_ids.tmdb': model.id });
    movie.ratings.tmdb = {
      rating: model.vote_average,
      vote_count: model.vote_count,
    };
    movie.ratings.imdb = {
      rating: 0,
      vote_count: 0,
    };
    movie.ratings.kinopoisk = {
      rating: 0,
      vote_count: 0,
    };
    movie.updatedAt = new Date();
    await movie.save();
    movieLogger.info(`ACTION: Рейтинг фильма с id:${movie.id} обновлен.`);
  }

  // async delMovieFromDb(movie_id) {
  //   const movie = await Movie.findOneAndDelete({id: movie_id});
  //   if (!movie) {
  //     console.log(
  //       `Фильм c id:${movie_id} не существует в базе данных`,
  //     );
  //     return;
  //   }
  //   console.log(
  //     `Фильм c tmdbID:${movie.external_ids.tmdb} и id:${movie.id} был удален из базы данных`,
  //   );
  //   logEvents(
  //     `ACTION:Удален  ---  WastedId:${movie.id} - tmdbID:${movie.external_ids.tmdb} - Title:${movie.title} `,
  //     'movieDBLog.log',
  //   );
  // }
}
export default new MovieService();
