import 'dotenv/config';
import axios from 'axios';
import MovieService from '../services/movieService.js';
import logEvents from '../../../middleware/logEvents.js';

axios.defaults.headers.common['Authorization'] =
  `Bearer ${process.env.TMDB_API_TOKEN}`;

class TmdbMovieAPI {
  async getMovie(req, res, next) {
    const start = new Date();
    const movieId = req.params.id;

    try {
      const response = await axios.get(
        process.env.TMDB_API_URL +
          '/movie/' +
          movieId +
          '?language=ru-RU&append_to_response=keywords,credits,images&include_image_language=ru,en',
      );
      const responseENG = await axios.get(
        process.env.TMDB_API_URL + '/movie/' + movieId + '?language=en-US',
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

    // for (let i = min; i <= max; i++) {
    //   try {
    //     const response = await axios.get(
    //       process.env.TMDB_API_URL +
    //         '/tv/' +
    //         i +
    //         '?language=ru-RU&append_to_response=keywords,aggregate_credits,images&include_image_language=ru,en',
    //     );
    //     const responseENG = await axios.get(
    //       process.env.TMDB_API_URL + '/tv/' + i + '?language=en-US',
    //     );
    //     await TVShowService.addTVShowToDb(response.data, responseENG.data);
    //     console.log(`Пройдено ${i} из ${max}`);
    //   } catch (error) {
    //     console.log(`Ошибка на ${i} из ${max} }`, error.message);
    //   }
    // }

    const end = new Date();
    console.log(`Начало `, start);
    console.log(`Конец `, end);
    const total = (end - start) / 1000;
    console.log(
      'Общее время ' +
        ~~(total / 60 / 60).toFixed(0) +
        'h ' +
        ~~((total / 60) % 60) +
        'm ' +
        ((total % 60).toFixed(0) + 's'),
    );
  }

  async getPopularMovies(req, res, next) {
    const page = req.query.page;
    try {
      const response = await axios.get(
        process.env.TMDB_API_URL +
          '/discover/movie' +
          '?language=ru-RU&page=' +
          page +
          '&sort_by=popularity.desc',
      );

      for (const item of response.data.results) {
        const newResponse = await axios.get(
          process.env.TMDB_API_URL +
            '/movie/' +
            item.id +
            '?language=ru-RU&append_to_response=keywords,credits,images&include_image_language=ru,en',
        );
        const responseENG = await axios.get(
          process.env.TMDB_API_URL + '/movie/' + item.id + '?language=en-US',
        );
        await MovieService.addMovieToDb(newResponse.data, responseENG.data);
      }
      res.json(response.data);
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
