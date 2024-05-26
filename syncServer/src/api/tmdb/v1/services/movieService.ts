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
      { tmdbID: movie.external_ids.tmdb, wastedId: movie.id },
      `ACTION: Фильм c tmdbID:${movie.external_ids.tmdb} уже существует в базе данных под id:${movie.id}`,
    );
    return movie;
  }

  async addMovieToDb(
    model: IMovie,
    modelENG?: IMovie,
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

      await Movie.updateOne(
        { 'external_ids.tmdb': model.id },
        {
          $set: {
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
        },
      );
      movieLogger.info(
        { tmdbID: movie.external_ids.tmdb, wastedId: movie.id },
        `ACTION: Фильм c tmdbID:${movie.external_ids.tmdb} из ${latestTMDBId || ''} был добавлен в базу под id:${movie.id}.`,
      );
      return movie.id;
    }
    movieLogger.info(
      { tmdbID: oldMovie.external_ids.tmdb, wastedId: oldMovie.id },
      `ACTION: Фильм c tmdbID:${oldMovie.external_ids.tmdb} уже существует под id:${oldMovie.id}.`,
    );
    return oldMovie.id;
  }

  async syncMovie(
    model: IMovie,
    modelENG: IMovie,
    isFullSync: boolean,
  ): Promise<IMovie> {
    const movie = await Movie.findOne({ 'external_ids.tmdb': model.id });
    if (!movie) {
      movieLogger.info(
        { tmdbID: model.id },
        `ACTION: Фильм c tmdbID:${model.id} не существует в базе данных`,
      );
      return movie;
    }
    const syncMovie = await Movie.findOneAndUpdate(
      { 'external_ids.tmdb': model.id },
      {
        $set: {
          title: model.title,
          title_original: model.original_title,
          release_date: model.release_date,
          description: model.overview,
          description_original: modelENG.overview,
          duration: model.runtime,
          updatedAt: new Date(),
        },
      },
    );
    if (isFullSync) {
      await this.syncFields(movie, model, modelENG);
    }
    await this.syncRatings(model);
    movieLogger.info(
      { wastedId: movie.id, tmdbID: model.id },
      `ACTION: Фильм c id:${movie.id} был обновлен.`,
    );
    return syncMovie;
  }

  async syncFields(
    movie: IMovie,
    model: IMovie,
    modelENG: IMovie,
  ): Promise<void> {
    await Movie.updateOne(
      { 'external_ids.tmdb': model.id },
      {
        $set: {
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
          updatedAt: new Date(),
        },
      },
    );
  }

  async syncPeoples(model: IMediaModel): Promise<void> {
    const movie = await Movie.findOne({
      'external_ids.tmdb': model.id,
    });
    await Movie.updateOne(
      { 'external_ids.tmdb': model.id },
      {
        director: await getPeoples(
          model.credits,
          'director',
          movie.id,
          'movie',
        ),
        cast: await getPeoples(model.credits, 'actor', movie.id, 'movie'),
      },
    );
  }

  async syncRatings(model: IMovie): Promise<void> {
    const movie = await Movie.findOne({ 'external_ids.tmdb': model.id });
    if (!movie) {
      movieLogger.info(
        { tmdbID: model.id },
        `Фильм с tmdbID:${model.id} не найден`,
      );
      return;
    }
    await Movie.updateOne(
      { 'external_ids.tmdb': model.id },
      {
        $set: {
          'ratings.tmdb': {
            rating: model.vote_average,
            vote_count: model.vote_count,
          },
          'ratings.imdb': {
            rating: 0,
            vote_count: 0,
          },
          'ratings.kinopoisk': {
            rating: 0,
            vote_count: 0,
          },
          updatedAt: new Date(),
        },
      },
    );
    movieLogger.info(
      { wastedId: movie.id, tmdbID: model.id },
      `ACTION: Рейтинг фильма с id:${movie.id} обновлен.`,
    );
  }

  async getLastMovieTMDBId(): Promise<number> {
    const lastMovieId = await Movie.findOne().sort({
      'external_ids.tmdb': -1,
    });
    if (!lastMovieId) {
      return 0;
    }
    return lastMovieId.external_ids.tmdb;
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
