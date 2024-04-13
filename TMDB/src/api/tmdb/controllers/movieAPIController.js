import 'dotenv/config';
import axios from 'axios';
import MovieService from '#api/tmdb/services/movieService.js';
import { logEvents } from '#apiV1/middleware/index.js';
import { Movie } from '#db/models/index.js';

const axiosMovie = axios.create({
  baseURL: process.env.TMDB_API_URL,
});
axiosMovie.defaults.headers.common['Authorization'] =
  `Bearer ${process.env.TMDB_API_TOKEN}`;

let abort = false;

class TmdbMovieAPI {
  async getMovie(req, res, next) {
    const movieId = req.params.id;

    try {
      const response = await axiosMovie.get(
        '/movie/' +
          movieId +
          '?language=ru-RU&append_to_response=keywords,credits,images&include_image_language=ru,en',
      );
      const responseENG = await axiosMovie.get(
        '/movie/' + movieId + '?language=en-US',
      );
      await MovieService.addMovieToDb(response.data, responseENG.data);

      res.json(response.data);
    } catch (error) {
      logEvents(
        `${'id:' + movieId + '-' + error?.name || error}: ${error?.message || error}`,
        'movieReqLog.log',
      );
      console.log(
        `ID:${movieId} Ошибка запроса фильма`,
        error?.message || error,
      );
    }
  }

  async getPopularMovies(req, res, next) {
    const pages = +req.query.pages;
    const popularIDs = [];
    try {
      for (let page = 1; page <= pages; page++) {
        const response = await axiosMovie.get(
          '/discover/movie' +
            '?language=ru-RU&page=' +
            page +
            '&sort_by=popularity.desc&vote_count.gte=100',
        );
        for (const item of response.data.results) {
          popularIDs.push(item.id);
        }
      }
      res.json(popularIDs);
      for (const item of popularIDs) {
        const newResponse = await axiosMovie.get(
          '/movie/' +
            item +
            '?language=ru-RU&append_to_response=keywords,credits,images&include_image_language=ru,en',
        );
        const responseENG = await axiosMovie.get(
          '/movie/' + item + '?language=en-US',
        );
        await MovieService.addMovieToDb(newResponse.data, responseENG.data);
      }
      console.log(`Список популярных фильмов получен`);
    } catch (error) {
      logEvents(
        `${error?.name || error}: ${error?.message || error}`,
        'movieReqLog.log',
      );
      console.log(
        `Ошибка получения популярных фильмов`,
        error?.message || error,
      );
    }
  }

  async getMoviesAll(req, res, next) {
    let latestTMDBId = 0;
    let latestWastedId = 0;
    abort = false;
    try {
      const lastMovieId = await Movie.findOne().sort({ $natural: -1 });
      if (lastMovieId) {
        latestWastedId = +lastMovieId.external_ids.tmdb + 1;
      }
      const response = await axiosMovie.get('/movie/latest');
      latestTMDBId = response.data.id;
    } catch (error) {
      console.log(`Ошибка запроса LatestTMDBID`);
    }

    for (let i = latestWastedId; i <= latestTMDBId; i++) {
      if (abort) break;
      try {
        const response = await axiosMovie.get(
          '/movie/' +
            i +
            '?language=ru-RU&append_to_response=external_ids,keywords,credits,images&include_image_language=ru,en',
        );

        const responseENG = await axiosMovie.get(
          '/movie/' + i + '?language=en-US',
        );
        await MovieService.addMovieToDb(response.data, responseENG.data);
      } catch (error) {
        logEvents(
          `${'id:' + i + '-' + error?.name || error}: ${error?.message || error}`,
          'movieReqLog.log',
        );
        console.log(`ID:${i} Ошибка запроса фильма`, error?.message || error);
        //if (error?.response?.status !== 404) break;
      }
    }
    res.json({ isOk: true });
    console.log(`Все фильмы добавлены`);
  }

  async abortMoviesAll(req, res, next) {
    abort = true;
    console.log(`Получение всех фильмов отменено`);
    res.json({ msg: 'Aborted' });
  }
}
export default new TmdbMovieAPI();
