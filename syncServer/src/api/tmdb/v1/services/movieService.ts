import { Movie } from '#db/models/index.js';
import {
  getMediaImages,
  getGenres,
  getCountries,
  getPeoples,
  getTags,
  getProdCompanies,
} from '#/utils/dbFields.js';
import { IMovieModel, IMovie } from '#/interfaces/IModel';
import { logger } from '#/middleware/logger';
import { logNames } from '#/config/index';

const movieLogger = logger(logNames.movie).child({ module: 'MovieService' });

class MovieService {
  async getMovie(id: number): Promise<IMovie | void> {
    const movie = await Movie.findOne({ 'external_ids.tmdb': id });
    if (!movie) {
      movieLogger.info(
        `ACTION: Фильма c tmdbID:${id} не существует в базе данных`,
      );
      return;
    }
    movieLogger.info(
      `ACTION: Фильм c tmdbID:${movie.external_ids.tmdb} уже существует в базе данных под id:${movie.id} - Title: ${movie.title}. `,
    );
    return movie;
  }

  async addMovieToDb(
    model: IMovieModel,
    modelENG?: IMovieModel,
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

  async syncMovie(
    model: IMovieModel,
    modelENG?: IMovieModel,
    latestTMDBId?: number,
  ): Promise<void> {
    const movie = await Movie.findOne({ 'external_ids.tmdb': model.id });
    if (!movie) {
      movieLogger.info(
        `ACTION: Фильм c tmdbID:${model.id} не существует в базе данных`,
      );
      return;
    }
    const tomorrow = new Date(movie.updatedAt);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const now = new Date();

    if (tomorrow < now) {
      await Movie.findOneAndUpdate(
        { 'external_ids.tmdb': model.id },
        {
          title: model.title,
          title_original: model.original_title,
          release_date: model.release_date,
          description: model.overview,
          description_original: modelENG.overview,
          duration: model.runtime,
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
    }
    movieLogger.info(
      `ACTION: Фильм c tmdbID:${movie.external_ids.tmdb} из ${latestTMDBId} был добавлен в базу под id:${movie.id}.`,
    );
  }

  async syncRatings(model: IMovieModel): Promise<void | { message: string }> {
    const movie = await Movie.findOne({ 'external_ids.tmdb': model.id });
    if (!movie) {
      movieLogger.info(`Фильм с tmdbID:${model.id} не найден`);
      return { message: 'Movie not found' };
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
      movieLogger.info(`ACTION: Рейтинг фильма с id:${movie.id} обновлен.`);
      return;
    }
    movieLogger.info(
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
