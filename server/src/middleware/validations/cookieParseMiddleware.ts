import type { IJwtPayload } from '#interfaces/IFields';
import { tokenService } from '#services/index.js';
import type { NextFunction, Response, Request } from 'express';

export async function cookieParseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    const userData = tokenService.validateAccessToken(
      accessToken,
    ) as IJwtPayload;
    req.user = userData;
    next();
  } catch (e) {
    next(e);
  }
}
