import jwt from 'jsonwebtoken';
import { Token } from '#db/models/index.js';
import type { IJwtPayload } from '#interfaces/IFields';
import type { DeleteResult } from 'mongodb';
import type { Types } from 'mongoose';
import type { ITokenModel } from '#interfaces/IModel';

class TokenService {
  generateTokens(payload: jwt.JwtPayload): jwt.JwtPayload {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn:
        process.env.NODE_ENV === 'development'
          ? '30d'
          : process.env.ACCESS_TOKEN_EXPIRES || '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn:
        process.env.NODE_ENV === 'development'
          ? '30d'
          : process.env.REFRESH_TOKEN_EXPIRES || '30d',
    });
    return { accessToken, refreshToken };
  }

  validateAccessToken(token: string): IJwtPayload {
    try {
      const userData = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
      ) as IJwtPayload;
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string): IJwtPayload {
    try {
      const userData = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
      ) as IJwtPayload;
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(
    userId: Types.ObjectId,
    refreshToken: string,
  ): Promise<ITokenModel> {
    const tokenData = await Token.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await Token.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken: string): Promise<DeleteResult> {
    const tokenData = await Token.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken: string): Promise<ITokenModel> {
    const tokenData = await Token.findOne({ refreshToken });
    return tokenData;
  }
}

export default new TokenService();
