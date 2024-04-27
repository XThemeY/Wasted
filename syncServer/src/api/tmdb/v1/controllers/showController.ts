import { logNames } from '#/config/logNames';
import { logger } from '#/middleware/index.js';
import ShowService from '#api/tmdb/v1/services/showService.js';
import { TVShow } from '#db/models/index.js';
import { NextFunction, Request, Response } from 'express';
import ApiError from '#/utils/apiError';
import RequestHandler from '#/api/ApiConfigs.js';

const showLogger = logger(logNames.movie).child({ module: 'TmdbMovieAPI' });

class TmdbShowAPI {
  private abort = false;

  async addShow(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const showId = req.params.id;
    try {
      const response = await RequestHandler.reqMedia('tv', showId);
      const responseENG = await RequestHandler.reqMedia('tv', showId, true);
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
            '&sort_by=popularity.desc&vote_count.gte=100',
        );
        for (const item of response.data.results) {
          popularIDs.push(item.id);
        }
      }
      res.json(popularIDs);
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
      console.log(`Список популярных шоу получен`);
    } catch (error) {
      logEvents(
        `${error?.name || error}: ${error?.message || error}`,
        'showReqLog.log',
      );

      console.log(`Ошибка получения популярных шоу`, error?.message || error);
    }
  }

  async getShowsAll(req, res, next) {
    let latestTMDBId = 0;
    let latestWastedId = 0;
    abort = false;
    try {
      const lastShowId = await TVShow.findOne().sort({ $natural: -1 });
      if (lastShowId) {
        latestWastedId = +lastShowId.external_ids.tmdb + 1;
      }
      const response = await axiosShow.get('/tv/latest');
      latestTMDBId = response.data.id;
    } catch (error) {
      console.log(`Ошибка запроса LatestTMDBID`);
    }

    for (let i = latestWastedId; i <= latestTMDBId; i++) {
      if (abort) break;
      try {
        const response = await axiosShow.get(
          '/tv/' +
            i +
            '?language=ru-RU&append_to_response=external_ids,keywords,credits,images&include_image_language=ru,en',
        );

        const responseENG = await axiosShow.get('/tv/' + i + '?language=en-US');
        await ShowService.addShowToDb(
          response.data,
          responseENG.data,
          latestTMDBId,
        );
      } catch (error) {
        logEvents(
          `${'TMDBIDid:' + i + '-' + error?.name || error}: ${error?.message || error}`,
          'showReqLog.log',
        );
        console.log(`TMDBID:${i} Ошибка запроса шоу`, error?.message || error);
        //if (error?.response?.status !== 404) break;
      }
    }

    res.json({ isOk: true });
    console.log(`Все шоу добавлены`);
  }

  async abortShowsAll(req, res, next) {
    abort = true;
    console.log(`Получение всех шоу отменено`);
    res.json({ msg: 'Aborted' });
  }
}

export default new TmdbShowAPI();
