import 'dotenv/config';
import axios from 'axios';
import ShowService from '../services/showService.js';
import logEvents from '../../../middleware/logEvents.js';

axios.defaults.headers.common['Authorization'] =
  `Bearer ${process.env.TMDB_API_TOKEN}`;

class TmdbShowAPI {
  async getShow(req, res, next) {
    const start = new Date();
    const showId = req.params.id;

    try {
      const response = await axios.get(
        process.env.TMDB_API_URL +
          '/tv/' +
          showId +
          '?language=ru-RU&append_to_response=external_ids,keywords,credits,images&include_image_language=ru,en',
      );
      const responseENG = await axios.get(
        process.env.TMDB_API_URL + '/tv/' + showId + '?language=en-US',
      );
      await ShowService.addShowToDb(response.data, responseENG.data);

      res.json(response.data);
    } catch (error) {
      logEvents(
        `${'id:' + showId + '-' + error?.name || error}: ${error?.message || error}`,
        'showReqLog.log',
      );
      console.log(
        `ID:${showId} Ошибка запроса фильма`,
        error?.message || error,
      );
    }

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

  async getPopularShows(req, res, next) {
    const page = req.query.page;
    try {
      const response = await axios.get(
        process.env.TMDB_API_URL +
          '/discover/tv' +
          '?language=ru-RU&page=' +
          page +
          '&sort_by=popularity.desc',
      );

      for (const item of response.data.results) {
        const newResponse = await axios.get(
          process.env.TMDB_API_URL +
            '/tv/' +
            item.id +
            '?language=ru-RU&append_to_response=keywords,credits,images&include_image_language=ru,en',
        );
        const responseENG = await axios.get(
          process.env.TMDB_API_URL + '/tv/' + item.id + '?language=en-US',
        );
        await showService.addshowToDb(newResponse.data, responseENG.data);
      }
      res.json(response.data);
      console.log(`Список популярного получен`);
    } catch (error) {
      logEvents(
        `${error?.name || error}: ${error?.message || error}`,
        'showReqLog.log',
      );
      console.log(
        `Ошибка получения популярных фильмов`,
        error?.message || error,
      );
    }
  }
}
export default new TmdbShowAPI();
