import { User, Role } from "../models/models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { secret } from "../config.js";

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: "365d" });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(500)
          .json({ message: "Ошибка при регистрации", errors });
      }
      const { username, login, password, email } = req.body;
      let candidate = await User.findOne({ login });
      if (candidate) {
        return res.status(500).json({
          message: `Пользователь с таким логином уже существует`,
        });
      }
      candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(500).json({
          message: `Пользователь с таким email уже существует`,
        });
      }
      const salt = await bcrypt.genSalt(7);
      const hashPassword = await bcrypt.hash(password, salt);
      const userRole = await Role.findOne({});
      const user = new User({
        username: username,
        login: login,
        email: email,
        password: hashPassword,
        roles: [userRole._id],
      });
      await user.save();
      return res.json({ message: "Пользователь успешно зарегистрирован" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Registration error" });
    }
  }
  async login(req, res) {
    try {
      const { login, password } = req.body;
      const user = await User.findOne({ login });
      if (!user) {
        return res.status(400).json({ message: `Неверный логин или пароль` });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: `Неверный логин или пароль` });
      }

      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login error" });
    }
  }
}

export default new authController();
