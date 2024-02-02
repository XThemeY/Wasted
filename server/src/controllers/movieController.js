import movieService from '../services/movieService.js';

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

  async getMovieAll(req, res, next) {
    try {
      const movie = await movieService.getMovieAll();
      return res.json(movie);
    } catch (e) {
      next(e);
    }
  }

  async searchMovie(req, res, next) {
    try {
      // const page = parseInt(req.query.page) - 1 || 0;
      // const limit = parseInt(req.query.limit) || 10;
      // const search = req.query.search || '';
      // let sort = req.query.sort || 'popular';
      // let genre = req.query.genre || 'All';
      const title = req.query.title?.toString();
      const findMovies = await movieService.searchMovie(title);
      return res.json(findMovies);
    } catch (e) {
      next(e);
    }
  }
}

export default new MovieController();
