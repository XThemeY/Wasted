import 'dotenv/config';
import axios from 'axios';
import ShowService from '../services/showService.js';
import logEvents from '../../../middleware/logEvents.js';

const axiosShow = axios.create({
  baseURL: process.env.TMDB_API_URL,
});
axiosShow.defaults.headers.common['Authorization'] =
  `Bearer ${process.env.TMDB_API_TOKEN}`;

class TmdbShowAPI {
  async getShow(req, res, next) {
    const showId = req.params.id;

    try {
      const response = await axiosShow.get(
        '/tv/' +
          showId +
          '?language=ru-RU&append_to_response=external_ids,keywords,credits,images&include_image_language=ru,en',
      );
      const responseENG = await axiosShow.get(
        '/tv/' + showId + '?language=en-US',
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
  }

  async getPopularShows(req, res, next) {
    const pages = +req.query.pages;
    const popularIDs = [];

    try {
      for (let page = 1; page <= pages; page++) {
        const response = await axiosShow.get(
          '/discover/tv' +
            '?language=ru-RU&page=' +
            page +
            '&sort_by=popularity.desc&with_genres=10759',
        );
        for (const item of response.data.results) {
          popularIDs.push(item.id);
        }
      }

      for (const item of popularIDs) {
        const newResponse = await axiosShow.get(
          '/tv/' +
            item +
            '?language=ru-RU&append_to_response=external_ids,keywords,credits,images&include_image_language=ru,en',
        );
        const responseENG = await axiosShow.get(
          '/tv/' + item + '?language=en-US',
        );
        await ShowService.addShowToDb(newResponse.data, responseENG.data);
      }

      res.json(popularIDs);
      console.log(`Список популярных шоу получен`);
    } catch (error) {
      logEvents(
        `${error?.name || error}: ${error?.message || error}`,
        'showReqLog.log',
      );

      console.log(`Ошибка получения популярных шоу`, error?.message || error);
    }
  }
}
export default new TmdbShowAPI();
