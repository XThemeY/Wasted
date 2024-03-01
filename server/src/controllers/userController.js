import { User } from '../database/models/index.js';
import userService from '../services/userService.js';

const excludeFields = '-_id -__v -password -email';

class UserController {
  async getUser(req, res, next) {
    try {
      const username = req.params.username;
      const user = await User.getUserByUsername(username)
        .populate('roles', excludeFields)
        .populate('favorites.movies', excludeFields)
        .exec();

      if (!user) {
        return res.status(400).json({
          message: `Пользователя не существует`,
        });
      }
      res.status(200).json(user).end();
    } catch (e) {
      console.log('getUser:', e);
      res.sendStatus(500);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async updateUser(req, res, next) {
    try {
      const nickname = req.params.username;
      const { gender } = req.body;
      if (!gender) {
        return res.sendStatus(400);
      }
      const user = await User.getUserByUsername(nickname);

      user.gender = gender;
      await user?.save();

      res.status(200).json(user).end();
    } catch (e) {
      console.log('getUserAll:', e);
      res.sendStatus(500);
    }
  }

  async setMovieToWasted(req, res, next) {
    try {
      const { movieId, status } = req.body;
      const username = req.user.username;
      await userService.setMovieToWasted(username, movieId, status);
      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  async setShowToWasted(req, res, next) {
    try {
      const { showId, status } = req.body;
      const username = req.user.username;
      await userService.setShowToWasted(username, showId, status);
      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  async setMovieToFav(req, res, next) {
    try {
      const { movieId } = req.body;
      const username = req.user.username;
      await userService.setMovieToFav(username, movieId);
      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  async setShowToFav(req, res, next) {
    try {
      const { showId } = req.body;
      const username = req.user.username;
      await userService.setShowToFav(username, showId);
      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
