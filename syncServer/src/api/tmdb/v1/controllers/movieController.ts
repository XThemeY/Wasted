import { logNames } from '#/config/index.js';
import { logger } from '#/middleware/index.js';
import ApiError from '#/utils/apiError';
import MovieService from '#api/tmdb/v1/services/movieService.js';
import { Request, Response, NextFunction } from 'express';
import RequestHandler from '#/api/ApiConfigs.js';

const movieLogger = logger(logNames.movie).child({ module: 'TmdbMovieAPI' });

class TmdbMovieAPI {
  private abort = false;
  async addMovie(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const movieId = req.params.id;
    try {
      const response = await RequestHandler.reqMedia('movie', movieId);
      const responseENG = await RequestHandler.reqMedia('movie', movieId, true);
      await MovieService.addMovieToDb(response.data, responseENG.data);
      return res.status(200);
    } catch (error) {
      return next(
        ApiError.BadRequest(
          'Ошибка добавления фильма',
          error?.message || error,
        ),
      );
    }
  }

  async syncMovie(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const movieId = req.params.id;
    try {
      const response = await RequestHandler.reqMedia('movie', movieId);
      await MovieService.syncMovie(response.data);
      return res.status(200);
    } catch (error) {
      return next(
        ApiError.BadRequest(
          'Ошибка синхронизации фильма',
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
    const movieId = req.params.id;
    try {
      const response = await RequestHandler.reqMedia(
        'movie',
        movieId,
        false,
        false,
      );
      await MovieService.syncRatings(response.data);
      return res.status(200);
    } catch (error) {
      return next(
        ApiError.BadRequest(
          'Ошибка синхронизации рейтинга',
          error?.message || error,
        ),
      );
    }
  }

  async getMoviesAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    this.abort = false;
    try {
      const latestWastedId = await MovieService.getLastMovieId();
      const latestTMDBId = (await RequestHandler.reqLatestMedia('movie')).data
        .id;

      for (let i = latestWastedId; i <= latestTMDBId; i++) {
        if (this.abort) break;
        try {
          const response = await RequestHandler.reqMedia('movie', i);
          const responseENG = await RequestHandler.reqMedia('movie', i, true);
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
      next(
        ApiError.BadRequest(
          'Ошибка получения фильмов',
          error?.message || error,
        ),
      );
    }
  }

  async abortMoviesAll(req: Request, res: Response): Promise<void> {
    this.abort = true;
    movieLogger.info(`Получение всех фильмов отменено`);
    res.status(200).json({ msg: 'Aborted' });
  }
}
export default new TmdbMovieAPI();
