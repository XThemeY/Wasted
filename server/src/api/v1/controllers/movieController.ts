import { movieService, wastedHistoryService } from '#services/index.js';
import {
  getRatingOptions,
  getGenreOptions,
  getСountryOptions,
  getStartYear,
  getEndYear,
  compareYears,
  getMaxDate,
  getMinDate,
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
import type { RatingRes, ReactionRes } from '#types/types';
import { MediaType, syncMedia } from '#utils/syncServer';

class MovieController {
  async getMovie(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<Movie> | void> {
    try {
      const { id } = req.params;
      const movie = await movieService.getMovie(+id);
      syncMedia(movie.external_ids.tmdb, MediaType.movie, movie.updatedAt);
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

      const [genres, countries] = await Promise.all([
        getGenreOptions(req.query.genre as string),
        getСountryOptions(req.query.country as string),
      ]);

      const start_year = await getStartYear(+req.query.start_year);
      const end_year = await getEndYear(+req.query.end_year);
      compareYears(start_year, end_year);

      const [start_year_default, end_year_default] = await Promise.all([
        getMinDate(),
        getMaxDate(),
      ]);
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
        start_year_default,
        end_year_default,
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
  ): Promise<Response<RatingRes> | void> {
    try {
      const id = +req.params.id;
      const username = req.user.username;
      const rating = getRatingOptions(req.body.rating);
      const userRating = await movieService.setRating(username, id, rating);
      const totalRating = await movieService.setTotalRating(id);
      const response = {
        userRating,
        totalRating,
      } as RatingRes;
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async setMovieReaction(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ReactionRes> | void> {
    try {
      const id = +req.params.id;
      const username = req.user.username;
      const reactions = req.body.reactions as string[];
      const userReactions = await movieService.setMovieReactions(
        username,
        id,
        reactions,
      );
      const movieReactions = await movieService.setTotalReactions(id);
      const response = {
        userReactions,
        reactions: movieReactions,
      } as ReactionRes;
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new MovieController();
