import { Movie } from '../db/models/index.js';
class MovieController {
  async getMovie(req, res) {
    try {
      const id = req.params.id;
      const movie = await Movie.getMovieById(id);

      if (!movie) {
        return res.status(400).json({
          message: `Неправильный адрес`,
        });
      }

      res.status(200).json(movie).end();
    } catch (e) {
      console.log('getMovie:', e);
      res.sendStatus(500);
    }
  }

  async getMovieAll(req, res) {
    try {
      const movies = await Movie.getMovieAll();

      if (!movies) {
        return res.status(400).json({
          message: `Неправильный адрес`,
        });
      }

      res.status(200).json(movies).end();
    } catch (e) {
      console.log('getMovieAll:', e);
      res.sendStatus(500);
    }
  }
}

export default new MovieController();
