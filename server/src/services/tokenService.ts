import jwt from 'jsonwebtoken';
import { Token } from '#db/models/index.js';
import type { IToken } from '#interfaces/IFields';
import type { DeleteResult } from 'mongodb';
import type { Types } from 'mongoose';

class TokenService {
  generateTokens(payload: jwt.JwtPayload): jwt.JwtPayload {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '30d',
    });
    return { accessToken, refreshToken };
  }

  validateAccessToken(token: string): string | jwt.JwtPayload {
    try {
      const userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string): string | jwt.JwtPayload {
    try {
      const userData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(
    userId: Types.ObjectId,
    refreshToken: string,
  ): Promise<IToken> {
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

  async findToken(refreshToken: string): Promise<IToken> {
    const tokenData = await Token.findOne({ refreshToken });
    return tokenData;
  }
}

export default new TokenService();
