import { Game } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { secret } from "../config.js";

const excludeFieldsStr = "-_id -__v -countries._id";

class gameController {
  async getGame(req, res) {
    try {
      const id = req.params.id;
      const game = await Game.findOne({ id: id }).select(excludeFieldsStr);

      if (!game) {
        return res.status(400).json({
          message: `Неправильный адрес`,
        });
      }
      res.json(game);
    } catch (e) {}
  }

  async getGameAll(req, res) {
    try {
      const game = await Game.find({}).select(excludeFieldsStr);

      if (!game) {
        return res.status(400).json({
          message: `Неправильный адрес`,
        });
      }
      res.json(game);
    } catch (e) {}
  }
}

export default new gameController();
