import { Movie } from "../models/models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { secret } from "../config.js";

const excludeFieldsStr = "-_id -__v -countries._id";

class movieController {
  async getMovie(req, res) {
    try {
      const id = req.params.id;
      const movie = await Movie.findOne({ id: id }).select(excludeFieldsStr);

      if (!movie) {
        return res.status(400).json({
          message: `Неправильный адрес`,
        });
      }
      res.json(movie);
    } catch (e) {}
  }

  async getMovieAll(req, res) {
    try {
      const movie = await Movie.find({}).select(excludeFieldsStr);

      if (!movie) {
        return res.status(400).json({
          message: `Неправильный адрес`,
        });
      }
      res.json(movie);
    } catch (e) {}
  }
}

export default new movieController();
