import { showService, wastedHistoryService } from '#services/index.js';
import ApiError from '#utils/apiError.js';
import {
  getGenreOptions,
  getСountryOptions,
  getTvPlatformsOptions,
  getRatingOptions,
  getStartYear,
  getEndYear,
  compareYears,
} from '#config/index.js';

class ShowController {
  async getShow(req, res, next) {
    try {
      const id = req.params.id;
      const tvShow = await showService.getShow(id);
      if (!tvShow) {
        return next(ApiError.BadRequest(`Неправильный адрес`));
      }
      res.json(tvShow);
    } catch (e) {
      next(e);
    }
  }

  async exploreShows(req, res, next) {
    try {
      const sort_by = req.query.sort_by.split('.');
      const genres = await getGenreOptions(req.query.genre);
      const countries = await getСountryOptions(req.query.country);
      const tvPlatforms = await getTvPlatformsOptions(req.query.tvplatform);
      const start_year = await getStartYear(req.query.start_year);
      const end_year = await getEndYear(req.query.end_year);
      compareYears(start_year, end_year);
      const page = req.query.page > 0 ? +req.query.page - 1 : 0;
      const limit = req.query.limit > 0 ? +req.query.limit : 20;
      const title = req.query.title || '';
      const isWatched = req.query.watched === 'true';
      const username = req.user.username;
      const wastedIds = isWatched
        ? await wastedHistoryService.getWastedIds(username, 'tvShows')
        : [];
      const shows = await showService.exploreShows({
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
      res.json(shows);
    } catch (e) {
      next(e);
    }
  }

  async setShowRating(req, res, next) {
    try {
      const { id } = req.params;
      const username = req.user.username;
      const rating = getRatingOptions(req.body.rating);
      const response = await showService.setRating(username, +id, rating);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new ShowController();
