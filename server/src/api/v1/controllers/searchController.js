import { showService, movieService } from 'Main/src/api/v1/services/index.js';
import {
  getSortOptions,
  getGenreOptions,
  getСountryOptions,
  getTvPlatformsOptions,
  getStartYear,
  getEndYear,
  compareYears,
} from 'Main/src/api/v1/config/index.js';

class SearchController {
  async search(req, res, next) {
    try {
      const sort_by = getSortOptions(req.query.sort_by);
      const genres = await getGenreOptions(req.query.genre);
      const countries = await getСountryOptions(req.query.country);
      const start_year = await getStartYear(req.query.start_year);
      const end_year = await getEndYear(req.query.end_year);
      const tvPlatforms = await getTvPlatformsOptions(req.query.tvplatform);
      compareYears(start_year, end_year);
      const page = req.query.page > 0 ? +req.query.page - 1 : 0;
      const limit = req.query.limit > 0 ? +req.query.limit : 20;
      const title = req.query.title || '';
      const watched = 'true';

      const movies = await movieService.exploreMovies({
        page,
        limit,
        sort_by,
        title,
        start_year,
        end_year,
        genres,
        countries,
        watched,
      });

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
        watched,
      });
      res.json({ shows, movies });
    } catch (e) {
      next(e);
    }
  }
}

export default new SearchController();
