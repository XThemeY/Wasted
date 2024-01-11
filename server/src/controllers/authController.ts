import { User, Role } from '../db/models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { secret } from '../config.js';
import { Request, Response } from 'express';

const generateAccessToken = (id: string, username: string) => {
  const payload = {
    id,
    username,
  };
  return jwt.sign(payload, secret, { expiresIn: '365d' });
};

class authController {
  async registration(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Ошибка при регистрации', errors });
      }
      const { username, password, email } = req.body;
      let existingUser = await User.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({
          message: `Пользователь с таким логином уже существует`,
        });
      }
      existingUser = await User.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          message: `Пользователь с таким email уже существует`,
        });
      }
      const salt = await bcrypt.genSalt(7);
      const hashPassword = await bcrypt.hash(password, salt);
      const userRole = await Role.getRole('User');
      const user = User.createUser({
        username: username,
        email: email,
        roles: [userRole._id],
        authentication: { password: hashPassword },
      });
      return res
        .status(200)
        .json({ message: 'Пользователь успешно зарегистрирован' })
        .end();
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Registration error' });
    }
  }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.getUserByEmail(email).select(
        '+authentication.password',
      );
      if (!user) {
        return res.status(400).json({ message: `Неверный логин или пароль` });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        user.authentication.password,
      );
      if (!isValidPassword) {
        return res.status(400).json({ message: `Неверный логин или пароль` });
      }

      user.authentication.sessionToken = generateAccessToken(
        user.id.toString(),
        user.username.toString(),
      );
      await user.save();
      res.cookie('WASTED-AUTH', user.authentication.sessionToken, {
        domain: 'localhost',
        path: '/',
      });
      return res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Login error' });
    }
  }
}

export default new authController();
