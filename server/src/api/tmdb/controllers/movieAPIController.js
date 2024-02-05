import 'dotenv/config';
import axios from 'axios';
import MovieService from '../services/movieService.js';
import logEvents from '../../../middleware/logEvents.js';

const axiosShow = axios.create({
  baseURL: process.env.TMDB_API_URL,
});
axiosShow.defaults.headers.common['Authorization'] =
  `Bearer ${process.env.TMDB_API_TOKEN}`;

class TmdbMovieAPI {
  async getMovie(req, res, next) {
    const movieId = req.params.id;

    try {
      const response = await axiosShow.get(
        '/movie/' +
          movieId +
          '?language=ru-RU&append_to_response=keywords,credits,images&include_image_language=ru,en',
      );
      const responseENG = await axiosShow.get(
        '/movie/' + movieId + '?language=en-US',
      );
      //await MovieService.addMovieToDb(response.data, responseENG.data);

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
        const response = await axiosShow.get(
          '/discover/movie' +
            '?language=ru-RU&page=' +
            page +
            '&sort_by=popularity.desc',
        );
        for (const item of response.data.results) {
          popularIDs.push(item.id);
        }
      }

      for (const item of popularIDs) {
        const newResponse = await axiosShow.get(
          '/movie/' +
            item +
            '?language=ru-RU&append_to_response=keywords,credits,images&include_image_language=ru,en',
        );
        const responseENG = await axiosShow.get(
          '/movie/' + item + '?language=en-US',
        );
        await MovieService.addMovieToDb(newResponse.data, responseENG.data);
      }
      res.json(popularIDs);
      console.log(`Список популярного получен`);
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
