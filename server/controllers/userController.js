import { User, Role, Movie } from "../models/models.js";

const excludeFields = "-_id -__v -password -email";

class userController {
  async getUser(req, res) {
    try {
      const login = req.params.login;
      const user = await User.findOne({ login: login }, excludeFields)
        .populate("roles", excludeFields)
        .populate("favorites.movies", excludeFields)
        .exec();

      if (!user) {
        return res.status(400).json({
          message: `Пользователя не существует`,
        });
      }

      res.json(user);
    } catch (e) {}
  }

  async getUserAll(req, res) {
    try {
      const users = await User.find({}, excludeFields)
        .populate("roles", excludeFields)
        .populate("favorites.movies", excludeFields)
        .exec();

      res.json(users);
    } catch (e) {}
  }
}

export default new userController();
