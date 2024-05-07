import { Movie } from '#db/models/index.js';
import {
  getMediaImages,
  getGenres,
  getCountries,
  getPeoples,
  getTags,
  getProdCompanies,
} from '#utils/dbFields.js';
import type { IMediaModel, IMovie } from '#interfaces/IModel.d.ts';
import { logger } from '#middleware/index.js';
import { logNames } from '#config/index.js';

const movieLogger = logger(logNames.movie).child({ module: 'MovieService' });

class MovieService {
  async getMovie(id: number): Promise<IMovie | void> {
    const movie = await Movie.findOne({ 'external_ids.tmdb': id });
    if (!movie) {
      movieLogger.info(
        { tmdbID: id },
        `ACTION: Фильма c tmdbID:${id} не существует в базе данных`,
      );
      return;
    }
    movieLogger.info(
      { tmdbID: +movie.external_ids.tmdb, wastedId: movie.id },
      `ACTION: Фильм c tmdbID:${movie.external_ids.tmdb} уже существует в базе данных под id:${movie.id}`,
    );
    return movie;
  }

  async addMovieToDb(
    model: IMediaModel,
    modelENG?: IMediaModel,
    latestTMDBId?: number,
  ): Promise<number> {
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
        { tmdbID: +movie.external_ids.tmdb, wastedId: movie.id },
        `ACTION: Фильм c tmdbID:${movie.external_ids.tmdb} из ${latestTMDBId || ''} был добавлен в базу под id:${movie.id}.`,
      );
      return movie.id;
    }
    movieLogger.info(
      { tmdbID: +oldMovie.external_ids.tmdb, wastedId: oldMovie.id },
      `ACTION: Фильм c tmdbID:${oldMovie.external_ids.tmdb} уже существует под id:${oldMovie.id}.`,
    );
    return oldMovie.id;
  }

  async syncMovie(model: IMediaModel, modelENG: IMediaModel): Promise<void> {
    const movie = await Movie.findOne({ 'external_ids.tmdb': model.id });
    if (!movie) {
      movieLogger.info(
        { tmdbID: model.id },
        `ACTION: Фильм c tmdbID:${model.id} не существует в базе данных`,
      );
      return;
    }

    movie.title = model.title;
    movie.title_original = model.original_title;
    movie.release_date = model.release_date;
    movie.description = model.overview;
    movie.description_original = modelENG.overview;
    movie.duration = model.runtime;

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
    await this.syncRatings(model);
    movie.updatedAt = new Date();
    await movie.save();
    movieLogger.info(
      { wastedId: movie.id },
      `ACTION: Фильм c id:${movie.id} был обновлен.`,
    );
  }

  async syncPeoples(model: IMediaModel): Promise<void> {
    const movie = await Movie.findOne({ 'external_ids.tmdb': model.id });
    movie.director = await getPeoples(
      model.credits,
      'director',
      movie.id,
      'movie',
    );
    movie.cast = await getPeoples(model.credits, 'actor', movie.id, 'movie');
    await movie.save();
  }

  async syncRatings(model: IMediaModel): Promise<void> {
    const movie = await Movie.findOne({ 'external_ids.tmdb': model.id });
    if (!movie) {
      movieLogger.info(
        { tmdbID: model.id },
        `Фильм с tmdbID:${model.id} не найден`,
      );
      return;
    }
    const tomorrow = new Date(movie.updatedAt);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const now = new Date();
    if (tomorrow < now) {
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
      movieLogger.info(
        { wastedId: movie.id },
        `ACTION: Рейтинг фильма с id:${movie.id} обновлен.`,
      );
      return;
    }
    movieLogger.info(
      { wastedId: movie.id },
      `ACTION: Рейтинг фильма с id:${movie.id} уже обновлен. Рейтинг обновляется каждые сутки.`,
    );
  }

  async getLastMovieId(): Promise<number> {
    const lastMovieId = await Movie.findOne().sort({ $natural: -1 });
    if (!lastMovieId) {
      return 0;
    }
    return +lastMovieId.external_ids.tmdb + 1;
  }

  // async delMovieFromDb(movie_id) {
  //   const movie = await Movie.findOneAndDelete({id: movie_id});
  //   if (!movie) {
  //     console.log(
  //       `Фильм c id:${movie_id} не существует в базе данных`,
  //     );
  //     return;
  //   }
  //   console.log( { tmdbID: +movie.external_ids.tmdb, wastedId: movie.id }
  //     `Фильм c tmdbID:${movie.external_ids.tmdb} и id:${movie.id} был удален из базы данных`,
  //   );
  // }
}
export default new MovieService();
