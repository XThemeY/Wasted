import { movieService, wastedHistoryService } from 'Main/src/api/v1/services/index.js';
import {
  getRatingOptions,
  getSortOptions,
  getGenreOptions,
  getСountryOptions,
  getStartYear,
  getEndYear,
  compareYears,
  getMediaReactions,
} from 'Main/src/api/v1/config/index.js';

class MovieController {
  async getMovie(req, res, next) {
    try {
      const { id } = req.params;
      const movie = await movieService.getMovie(id);
      return res.json(movie);
    } catch (e) {
      next(e);
    }
  }

  async updateMovie(req, res, next) {
    try {
      const { id } = req.params;
      const options = req.body;
      const movie = await movieService.updateMovie(id, options);
      return res.json(movie);
    } catch (e) {
      next(e);
    }
  }

  async exploreMovies(req, res, next) {
    try {
      const sort_by = getSortOptions(req.query.sort_by);
      const genres = await getGenreOptions(req.query.genre);
      const countries = await getСountryOptions(req.query.country);
      const start_year = await getStartYear(req.query.start_year);
      const end_year = await getEndYear(req.query.end_year);
      compareYears(start_year, end_year);
      const page = req.query.page > 0 ? +req.query.page - 1 : 0;
      const limit = req.query.limit > 0 ? +req.query.limit : 20;
      const title = req.query.title || '';
      const isWatched = req.query.watched === 'true';
      const username = req.user.username;
      const wastedIds = isWatched
        ? await wastedHistoryService.getWastedIds(username, 'movies')
        : [];

      const movies = await movieService.exploreMovies({
        page,
        limit,
        sort_by,
        title,
        start_year,
        end_year,
        genres,
        countries,
        wastedIds,
      });
      res.json(movies);
    } catch (e) {
      next(e);
    }
  }

  async setMovieRating(req, res, next) {
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

  async setMovieReaction(req, res, next) {
    try {
      const { id } = req.params;
      const username = req.user.username;
      const reactions = getMediaReactions(req.body.reactions);
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
