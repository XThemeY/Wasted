import { tokenService } from '#services/index.js';
import type { NextFunction, Response, Request } from 'express';

export async function cookieParseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    const userData = tokenService.validateAccessToken(accessToken);
    req.user = userData;
    next();
  } catch (e) {
    next(e);
  }
}
