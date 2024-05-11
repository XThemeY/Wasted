import ApiError from '#utils/apiError.js';
import { tokenService } from '#services/index.js';
import { ROLES } from '#config/index.js';
import { NextFunction, Response, Request } from 'express';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.NotAuthorized());
    }
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.NotAuthorized());
    }
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.NotAuthorized());
    }
    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.NotAuthorized());
  }
}

export async function isOwner(req, res, next) {
  try {
    const { username } = req.params;
    const currentUserName = req.user.username;
    const roles = req.user.userRoles;
    if (!currentUserName) {
      return next(ApiError.Forbidden());
    }
    if (roles.includes([ROLES.ADMIN, ROLES.MODERATOR])) {
      return next();
    }
    if (currentUserName !== username) {
      return next(ApiError.Forbidden());
    }

    next();
  } catch (e) {
    return next(ApiError.Forbidden());
  }
}
