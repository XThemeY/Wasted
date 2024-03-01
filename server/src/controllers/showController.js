import showService from '../services/showService.js';
import userService from '../services/userService.js';
import { getSortOptions } from '../config/sortOptions.js';
import { getGenreOptions } from '../config/genreOptions.js';
import { getСountryOptions } from '../config/countryOptions.js';
import { getTvPlatformsOptions } from '../config/tvplatformOptions.js';
import {
  getStartYear,
  getEndYear,
  compareYears,
} from '../config/yearOptions.js';
class ShowController {
  async getShow(req, res) {
    try {
      const id = req.params.id;

      if (!tvShow) {
        return res.status(400).json({
          message: `Неправильный адрес`,
        });
      }
      res.json(tvShow);
    } catch (e) {}
  }

  async exploreShows(req, res, next) {
    try {
      const sort_by = getSortOptions(req.query.sort_by);
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
      const username = req.user?.username;
      const wastedIds = isWatched
        ? await userService.getWastedIds(username, 'tvShows')
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
}

export default new ShowController();
