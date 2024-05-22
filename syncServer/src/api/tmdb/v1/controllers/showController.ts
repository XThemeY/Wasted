import { logNames } from '#config/index.js';
import { logger } from '#middleware/index.js';
import ShowService from '#api/tmdb/v1/services/showService.js';
import { NextFunction, Request, Response } from 'express';
import RequestHandler from '#api/ApiConfigs.js';

const showLogger = logger(logNames.show).child({ module: 'TmdbShowAPI' });

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
      next(error);
    }
  }

  async syncShow(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const showId = req.params.id;
    const isFullSync = req.query.fullSync === 'true';
    try {
      const response = await RequestHandler.reqMedia(TmdbShowAPI._type, showId);

      const responseENG = await RequestHandler.reqMedia(
        TmdbShowAPI._type,
        showId,
        true,
        false,
      );

      await ShowService.syncShow(response.data, responseENG.data, isFullSync);
      return res.sendStatus(200);
    } catch (error) {
      return next(error);
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
      return next(error);
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
      return next(error);
    }
  }

  async syncShowsAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    TmdbShowAPI._abort = false;
    try {
      const startWastedId =
        +req.query.startAt || (await ShowService.getLastShowId());

      const latestTMDBId =
        +req.query.endAt ||
        (await RequestHandler.reqLatestMedia(TmdbShowAPI._type)).data.id;

      for (let i = startWastedId; i <= latestTMDBId; i++) {
        if (TmdbShowAPI._abort) {
          return res.json({
            message: `Получение шоу отменено`,
            last_index: i,
          });
        }
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
            `ID:${i} Ошибка запроса шоу - ${error?.message}`,
            error,
          );
        }
      }
      showLogger.info(`Все шоу добавлены`);
      return res.sendStatus(200);
    } catch (error) {
      return next(error);
    }
  }

  async abortShowsAll(req: Request, res: Response): Promise<void> {
    TmdbShowAPI._abort = true;
    showLogger.info(`Получение шоу отменено`);
    res.sendStatus(200);
  }
}

export default new TmdbShowAPI();
