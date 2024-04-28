import { logNames } from '#/config/index';
import { logger } from '#/middleware/index.js';
import ShowService from '#api/tmdb/v1/services/showService.js';
import { NextFunction, Request, Response } from 'express';
import ApiError from '#/utils/apiError';
import RequestHandler from '#/api/ApiConfigs.js';

const showLogger = logger(logNames.movie).child({ module: 'TmdbShowAPI' });

class TmdbShowAPI {
  private static _abort = false;
  private static _type = 'tv';

  async addShow(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const showId = req.params.id;
    try {
      const response = await RequestHandler.reqMedia(TmdbShowAPI._type, showId);
      const responseENG = await RequestHandler.reqMedia(
        TmdbShowAPI._type,
        showId,
        true,
        false,
      );
      await ShowService.addShowToDb(response.data, responseENG.data);
      return res.json(response.data);
    } catch (error) {
      next(ApiError.BadRequest(error?.message, error.errors || error));
    }
  }

  async syncShow(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const showId = req.params.id;
    try {
      const response = await RequestHandler.reqMedia(TmdbShowAPI._type, showId);
      const responseENG = await RequestHandler.reqMedia(
        TmdbShowAPI._type,
        showId,
        true,
        false,
      );
      await ShowService.syncShow(response.data, responseENG.data);
      return res.sendStatus(200);
    } catch (error) {
      return next(
        ApiError.BadRequest(
          'Ошибка синхронизации шоу',
          error?.message || error,
        ),
      );
    }
  }

  async syncRatings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const showId = req.params.id;
    try {
      const response = await RequestHandler.reqMedia(
        TmdbShowAPI._type,
        showId,
        false,
        false,
      );
      await ShowService.syncRatings(response.data);
      return res.sendStatus(200);
    } catch (error) {
      return next(
        ApiError.BadRequest(
          'Ошибка синхронизации рейтинга шоу c id:' + showId,
          error?.message || error,
        ),
      );
    }
  }

  async getPopularShows(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const pages = +req.query.pages;
    const popularIDs = [];
    const wastedIds = [];
    try {
      for (let page = 1; page <= pages; page++) {
        const response = await RequestHandler.reqPopularMedia(
          TmdbShowAPI._type,
          page,
        );
        for (const item of response.data.results) {
          popularIDs.push(item.id);
        }
      }
      for (const item of popularIDs) {
        const newResponse = await RequestHandler.reqMedia(
          TmdbShowAPI._type,
          item,
        );
        const responseENG = await RequestHandler.reqMedia(
          TmdbShowAPI._type,
          item,
          true,
          false,
        );
        const id = await ShowService.addShowToDb(
          newResponse.data,
          responseENG.data,
        );
        wastedIds.push(id);
      }
      return res.status(200).json({ showIds: wastedIds });
    } catch (error) {
      return next(
        ApiError.BadRequest(
          'Ошибка получения популярных шоу',
          error?.message || error,
        ),
      );
    }
  }

  async getShowsAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    TmdbShowAPI._abort = false;
    try {
      const latestWastedId = await ShowService.getLastShowId();
      const latestTMDBId = (
        await RequestHandler.reqLatestMedia(TmdbShowAPI._type)
      ).data.id;

      for (let i = latestWastedId; i <= latestTMDBId; i++) {
        if (TmdbShowAPI._abort) break;
        try {
          const response = await RequestHandler.reqMedia(TmdbShowAPI._type, i);
          const responseENG = await RequestHandler.reqMedia(
            TmdbShowAPI._type,
            i,
            true,
          );
          await ShowService.addShowToDb(
            response.data,
            responseENG.data,
            latestTMDBId,
          );
        } catch (error) {
          showLogger.error(
            `ID:${i} Ошибка запроса фильма`,
            error?.message || error,
          );
        }
      }
      showLogger.info(`Все шоу добавлены`);
      return res.sendStatus(200);
    } catch (error) {
      next(
        ApiError.BadRequest(
          'Ошибка получения фильмов',
          error?.message || error,
        ),
      );
    }
  }

  async abortShowsAll(req: Request, res: Response): Promise<Response> {
    TmdbShowAPI._abort = true;
    showLogger.info(`Получение шоу отменено`);
    return res.sendStatus(200);
  }
}

export default new TmdbShowAPI();
