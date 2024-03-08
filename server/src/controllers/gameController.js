import { Game } from '../database/models/index.js';
import ApiError from '../utils/apiError.js';

class GameController {
  async getGame(req, res, next) {
    try {
      const id = req.params.id;
      const game = await Game.findOne({ id: id });

      if (!game) {
        return next(ApiError.BadRequest(`Неправильный адрес`));
      }
      res.json(game);
    } catch (e) {
      next(e);
    }
  }

  async getGameAll(req, res, next) {
    try {
      const games = await Game.find({});
      const totalCount = await Game.countDocuments({});
      if (!games) {
        return next(ApiError.BadRequest(`Неправильный адрес`));
      }
      const response = { items: games, total_items: totalCount };
      res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new GameController();
