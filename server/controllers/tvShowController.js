import { TVShow } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { secret } from "../config.js";

const excludeFieldsStr = "-_id -__v -countries._id";

class tvShowController {
  async getTVShow(req, res) {
    try {
      const id = req.params.id;
      const tvShow = await TVShow.findOne({ id: id }).select(excludeFieldsStr);

      if (!tvShow) {
        return res.status(400).json({
          message: `Неправильный адрес`,
        });
      }
      res.json(tvShow);
    } catch (e) {}
  }

  async getTVShowAll(req, res) {
    try {
      const tvShow = await TVShow.find({}).select(excludeFieldsStr);

      if (!tvShow) {
        return res.status(400).json({
          message: `Неправильный адрес`,
        });
      }
      res.json(tvShow);
    } catch (e) {}
  }
}

export default new tvShowController();
