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
      return next(ApiError.Forbidden());
    }
    req.user = userData;
    next();
  } catch (e) {
    return next(e);
  }
}

export async function isOwner(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { username } = req.params;
    const currentUserName = req.user.username;
    const roles = req.user.userRoles;
    if (!currentUserName) {
      return next(ApiError.NotAuthorized());
    }
    if ([ROLES.ADMIN, ROLES.MODERATOR].some((role) => roles.includes(role))) {
      return next();
    }
    if (currentUserName !== username) {
      return next(ApiError.Forbidden());
    }

    next();
  } catch (e) {
    return next(e);
  }
}

export async function isProfileOwner(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { username } = req.params;
    const currentUserName = req.user?.username;

    if (currentUserName !== username) {
      req.isProfileOwner = false;
    } else {
      req.isProfileOwner = true;
    }

    next();
  } catch (e) {
    return next(e);
  }
}
