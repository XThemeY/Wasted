import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { UserDto } from '#dtos/index.js';
import { Role, User } from '#db/models/index.js';
import ApiError from '#utils/apiError.js';
import { mailService, tokenService } from '#apiV1/services/index.js';

class AuthService {
  async registration(username, email, password) {
    const newUser =
      (await User.findOne({ email }).exec()) ||
      (await User.findOne({ username }).exec());
    if (newUser) {
      throw ApiError.BadRequest(
        `Пользователь с таким именем/email уже существует`,
      );
    }
    const hashPassword = await bcrypt.hash(password, 7);
    const activationLink = nanoid();
    const roles = await Role.findOne({ role: 'User' });
    const user = await User.create({
      username,
      email,
      'settings.userRoles': [roles.role],
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
    }).exec();
    if (!user) {
      throw ApiError.BadRequest('Неккоректная ссылка активации');
    }
    user.authentication.isActivated = true;
    await user.save();
  }

  async login(login, password) {
    const user =
      (await User.findOne({ email: login }).exec()) ||
      (await User.findOne({ username: login }).exec());
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

    const user = await User.findById(userData._id).exec();
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
