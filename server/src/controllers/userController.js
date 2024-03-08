import userService from '../services/userService.js';
import ApiError from '../utils/apiError.js';
class UserController {
  async getUser(req, res, next) {
    try {
      const username = req.params.username;
      const user = await userService.getUser(username);

      if (!user) {
        return next(ApiError.BadRequest('Пользователя не существует'));
      }
      res.json(user);
    } catch (e) {
      next(e);
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

  async getUserSettings(req, res, next) {
    try {
      const nickname = req.params.username;
      const options = await userService.getUserSettings(nickname);
      return res.json(options);
    } catch (e) {
      next(e);
    }
  }

  async setUserSettings(req, res, next) {
    try {
      const username = req.params.username;
      const body = req.body;

      if (!body) {
        return next(ApiError.BadRequest('Ошибка запроса'));
      }
      const settings = await userService.setUserSettings(username, body);
      return res.json(settings);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
