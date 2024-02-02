import { Game } from '../database/models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class GameController {
  async getGame(req, res) {
    try {
      const id = req.params.id;
      const game = await Game.findOne({ id: id });

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
      const games = await Game.find({});
      const totalCount = await Game.countDocuments({});
      if (!games) {
        return res.status(400).json({
          message: `Неправильный адрес`,
        });
      }
      const response = { items: games, total_items: totalCount };
      res.json(response);
    } catch (e) {
      res.status(500).send(e);
    }
  }
}

export default new GameController();
