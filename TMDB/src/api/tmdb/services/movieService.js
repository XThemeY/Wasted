import { Movie } from '#db/models/index.js';
import {
  getMediaImages,
  getGenres,
  getCountries,
  getPeoples,
  getTags,
  getProdCompanies,
} from '#utils/dbFields.js';
import { logEvents } from '#apiV1/middleware/index.js';

class MovieService {
  async addMovieToDb(model, modelENG) {
    let movie = await Movie.findOne({ 'external_ids.tmdb': model.id });
    if (!movie) {
      const newMovie = await Movie.create({
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

      movie = await Movie.findOne({ id: newMovie.id });

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
      console.log(
        `Фильм c tmdbID:${movie.external_ids.tmdb} был добавлен в базу под id:${movie.id}`,
      );
      logEvents(
        `ACTION:Добавлен в базу  ---  WastedId:${movie.id} - tmdbID:${movie.external_ids.tmdb} - Title:${movie.title} `,
        'movieDBLog.log',
      );
      return;
    }

    console.log(
      `Фильм c tmdbID:${movie.external_ids.tmdb} уже существует в базе данных под id:${movie.id}`,
    );
    logEvents(
      `ACTION:Уже существует  ---  WastedId:${movie.id} - tmdbID:${movie.external_ids.tmdb} - Title:${movie.title} `,
      'movieDBLog.log',
    );
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
