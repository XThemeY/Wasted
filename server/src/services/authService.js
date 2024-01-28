import { User } from '../db/models/index.js';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import mailService from './mailService.js';
import tokenService from './tokenService.js';
import UserDto from '../dtos/userDto.js';
import ApiError from '../exceptions/apiError.js';

class AuthService {
  async registration(username, email, password) {
    const newUser =
      (await User.findOne({ email })) || (await User.findOne({ username }));
    if (newUser) {
      throw ApiError.BadRequest(
        `Пользователь с таким именем/email уже существует`,
      );
    }
    const hashPassword = await bcrypt.hash(password, 7);
    const activationLink = nanoid();
    const user = await User.create({
      username,
      email,
      authentication: { password: hashPassword, activationLink },
    });
    await mailService.sendActivaionLink(
      email,
      `${process.env.API_URL}/auth/activate/${activationLink}`,
    );
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto._id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink) {
    const user = await User.findOne({
      'authentication.activationLink': activationLink,
    });
    if (!user) {
      throw ApiError.BadRequest('Неккоректная ссылка активации');
    }
    user.authentication.isActivated = true;
    await user.save();
  }

  async login(login, password) {
    const user =
      (await User.findOne({ email: login })) ||
      (await User.findOne({ username: login }));
    if (!user) {
      throw ApiError.BadRequest(
        `Пользователь с таким именем/email не существует`,
      );
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.authentication.password,
    );
    if (!isValidPassword) {
      throw ApiError.BadRequest(`Неверный пароль`);
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto._id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnathorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const dbToken = await tokenService.findToken(refreshToken);
    if (!userData || !dbToken) {
      throw ApiError.UnathorizedError();
    }

    const user = await User.findById(userData._id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto._id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }
}

export default new AuthService();
