import { logNames } from '#config/index.js';
import { logger } from '#middleware/index.js';
import RequestHandler from '#api/ApiConfigs.js';
import MovieService from '#api/tmdb/v1/services/movieService.js';
import { Request, Response, NextFunction } from 'express';

const movieLogger = logger(logNames.movie).child({ module: 'TmdbMovieAPI' });

class TmdbMovieAPI {
  private static _abort = false;
  private static _type = 'movie';

  async addMovie(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const movieId = req.params.id;
    try {
      const response = await RequestHandler.reqMedia(
        TmdbMovieAPI._type,
        movieId,
      );
      const responseENG = await RequestHandler.reqMedia(
        TmdbMovieAPI._type,
        movieId,
        true,
      );
      await MovieService.addMovieToDb(response.data, responseENG.data);
      return res.status(200);
    } catch (error) {
      return next(error);
    }
  }

  async syncMovie(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const movieId = req.params.id;

    try {
      const response = await RequestHandler.reqMedia(
        TmdbMovieAPI._type,
        movieId,
      );
      const responseENG = await RequestHandler.reqMedia(
        TmdbMovieAPI._type,
        movieId,
        true,
        false,
      );
      await MovieService.syncMovie(response.data, responseENG.data);
      return res.status(200);
    } catch (error) {
      return next(error);
    }
  }

  async syncRatings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const movieId = req.params.id;
    try {
      const response = await RequestHandler.reqMedia(
        TmdbMovieAPI._type,
        movieId,
        false,
        false,
      );
      await MovieService.syncRatings(response.data);
      return res.status(200);
    } catch (error) {
      return next(error);
    }
  }

  async getPopularMovies(
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
          TmdbMovieAPI._type,
          page,
        );
        for (const item of response.data.results) {
          popularIDs.push(item.id);
        }
      }
      for (const item of popularIDs) {
        const newResponse = await RequestHandler.reqMedia(
          TmdbMovieAPI._type,
          item,
        );
        const responseENG = await RequestHandler.reqMedia(
          TmdbMovieAPI._type,
          item,
          true,
          false,
        );
        const id = await MovieService.addMovieToDb(
          newResponse.data,
          responseENG.data,
        );
        wastedIds.push(id);
      }
      return res.status(200).json({ movieIds: wastedIds });
    } catch (error) {
      return next(error);
    }
  }

  async getMoviesAll(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    TmdbMovieAPI._abort = false;
    try {
      const latestWastedId = await MovieService.getLastMovieId();
      const latestTMDBId = (
        await RequestHandler.reqLatestMedia(TmdbMovieAPI._type)
      ).data.id;

      for (let i = latestWastedId; i <= latestTMDBId; i++) {
        if (TmdbMovieAPI._abort) break;
        try {
          const response = await RequestHandler.reqMedia(TmdbMovieAPI._type, i);
          const responseENG = await RequestHandler.reqMedia(
            TmdbMovieAPI._type,
            i,
            true,
            false,
          );
          await MovieService.addMovieToDb(
            response.data,
            responseENG.data,
            latestTMDBId,
          );
        } catch (error) {
          movieLogger.error(
            `ID:${i} Ошибка запроса фильма`,
            error?.message || error,
          );
        }
      }
      res.status(200);
      movieLogger.info(`Все фильмы добавлены`);
    } catch (error) {
      next(error);
    }
  }

  async abortMoviesAll(_req: Request, res: Response): Promise<void> {
    TmdbMovieAPI._abort = true;
    movieLogger.info(`Получение фильмов отменено`);
    res.status(200);
  }
}
export default new TmdbMovieAPI();
