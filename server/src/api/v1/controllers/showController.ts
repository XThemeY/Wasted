import { showService, wastedHistoryService } from '#services/index.js';
import ApiError from '#utils/apiError.js';
import {
  getGenreOptions,
  getСountryOptions,
  getTvPlatformsOptions,
  getStartYear,
  getEndYear,
  compareYears,
} from '#config/index.js';
import type { NextFunction, Request, Response } from 'express';
import type {
  IErrMsg,
  ISearchQuery,
  IShowSearchResult,
} from '#interfaces/IApp';
import { Show } from '#utils/dtos/showDto';

class ShowController {
  async getShow(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const tvShow = await showService.getShow(+id);
      if (!tvShow) {
        return next(ApiError.BadRequest(`Шоу с таким id:${id} не существует`));
      }
      const response = new Show(tvShow);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async exploreShows(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IShowSearchResult | IErrMsg> | void> {
    try {
      const sort_by = (req.query.sort_by as string).split('.');
      const genres = await getGenreOptions(req.query.genre as string);
      const countries = await getСountryOptions(req.query.country as string);
      const tvPlatforms = await getTvPlatformsOptions(
        req.query.tvplatform as string,
      );
      const start_year = await getStartYear(+req.query.start_year);
      const end_year = await getEndYear(+req.query.end_year);
      compareYears(start_year, end_year);
      const page = +req.query.page - 1;
      const limit = +req.query.limit;
      const title = req.query.title;
      const isWatched = req.query.watched;
      const username = req.user?.username || '';
      const wastedIds = isWatched
        ? await wastedHistoryService.getWastedIds(username, 'tvShows')
        : [];
      console.log({
        page,
        limit,
        sort_by,
        title,
        start_year,
        end_year,
        genres,
        countries,
        tvPlatforms,
        wastedIds,
      });

      const response = await showService.exploreShows({
        page,
        limit,
        sort_by,
        title,
        start_year,
        end_year,
        genres,
        countries,
        tvPlatforms,
        wastedIds,
      } as ISearchQuery);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }

  // async setShowRating(req, res, next) {
  //   try {
  //     const { id } = req.params;
  //     const username = req.user.username;
  //     const rating = getRatingOptions(req.body.rating);
  //     const response = await showService.setRating(username, +id, rating);
  //     return res.json(response);
  //   } catch (e) {
  //     next(e);
  //   }
  // }
}

export default new ShowController();
