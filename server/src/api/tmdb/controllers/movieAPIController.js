import 'dotenv/config';
import axios from 'axios';
import MovieService from '#api/tmdb/services/movieService.js';
import { logEvents } from '#apiV1/middleware/index.js';

const axiosMovie = axios.create({
  baseURL: process.env.TMDB_API_URL,
});
axiosMovie.defaults.headers.common['Authorization'] =
  `Bearer ${process.env.TMDB_API_TOKEN}`;

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
}
export default new TmdbMovieAPI();
