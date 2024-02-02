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
}

export default new UserController();
