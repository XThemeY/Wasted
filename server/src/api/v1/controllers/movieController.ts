import { movieService, wastedHistoryService } from '#services/index.js';
import {
  getRatingOptions,
  getGenreOptions,
  getСountryOptions,
  getStartYear,
  getEndYear,
  compareYears,
} from '#config/index.js';
import type { NextFunction, Response, Request } from 'express';
import { Movie } from '#utils/dtos/index.js';
import ApiError from '#utils/apiError';
import type {
  IErrMsg,
  IMovieSearchResult,
  IMovieUpdate,
  ISearchQuery,
} from '#interfaces/IApp';
import type { Reactions, ResponseMsg } from '#types/types';

class MovieController {
  async getMovie(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<Movie> | void> {
    try {
      const { id } = req.params;
      const movie = await movieService.getMovie(+id);
      if (!movie) {
        throw ApiError.BadRequest(`Фильма с таким id:${id} не существует`);
      }
      const response = new Movie(movie);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async updateMovie(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<Movie> | void> {
    try {
      const { id } = req.params;
      const options = req.body as IMovieUpdate;
      const movie = await movieService.updateMovie(+id, options);
      if (!movie) {
        throw ApiError.BadRequest(`Фильма с таким id:${id} не существует`);
      }
      const response = new Movie(movie);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async exploreMovies(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IMovieSearchResult | IErrMsg> | void> {
    try {
      const sort_by = (req.query.sort_by as string).split('.');
      const genres = await getGenreOptions(req.query.genre as string);
      const countries = await getСountryOptions(req.query.country as string);
      const start_year = await getStartYear(+req.query.start_year);
      const end_year = await getEndYear(+req.query.end_year);
      compareYears(start_year, end_year);
      const page = +req.query.page - 1;
      const limit = +req.query.limit;
      const title = req.query.title;
      const isWatched = req.query.watched;
      const username = req.user?.username || '';
      const wastedIds = isWatched
        ? await wastedHistoryService.getWastedIds(username, 'movies')
        : [];

      const response = await movieService.exploreMovies({
        page,
        limit,
        sort_by,
        title,
        start_year,
        end_year,
        genres,
        countries,
        wastedIds,
      } as ISearchQuery);

      res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async setMovieRating(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ResponseMsg> | void> {
    try {
      const { id } = req.params;
      const username = req.user.username;
      const rating = getRatingOptions(req.body.rating);
      const response = await movieService.setRating(username, +id, rating);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async setMovieReaction(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ResponseMsg> | void> {
    try {
      const { id } = req.params;
      const username = req.user.username;
      const reactions = req.body.reactions as string[];

      const response = await movieService.setMovieReactions(
        username,
        +id,
        reactions,
      );
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new MovieController();
