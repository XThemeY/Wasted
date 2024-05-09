import type { IJwtPayload, IReqWithUserData } from '#interfaces/IFields';
import { tokenService } from '#services/index.js';
import type { NextFunction, Response } from 'express';

export async function userDataMiddleware(
  req: IReqWithUserData,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader.split(' ')[1];
    const userData = tokenService.validateAccessToken(
      accessToken,
    ) as IJwtPayload;

    req.user = userData;
    next();
  } catch (e) {
    next(e);
  }
}
