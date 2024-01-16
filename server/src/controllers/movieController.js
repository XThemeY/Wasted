import { Movie } from '../db/models/index.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { secret } from '../config.js'

const excludeFieldsStr = '-_id -__v -countries._id'

class MovieController {
  async getMovie(req, res) {
    try {
      const id = req.params.id
      const movie = await Movie.findOne({ id: id }).select(excludeFieldsStr)

      if (!movie) {
        return res.status(400).json({
          message: `Неправильный адрес`,
        })
      }
      res.json(movie)
    } catch (e) {}
  }

  async getMovieAll(req, res) {
    try {
      const movies = await Movie.find({}).select(excludeFieldsStr)
      const totalCount = await Movie.countDocuments({})

      if (!movies) {
        return res.status(400).json({
          message: `Неправильный адрес`,
        })
      }

      const response = { items: movies, total_items: totalCount }
      res.json(response)
    } catch (e) {
      res.status(500).send(e)
    }
  }
}

export default new MovieController()
