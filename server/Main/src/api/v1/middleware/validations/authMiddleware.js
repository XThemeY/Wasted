import ApiError from 'Main/src/utils/apiError.js';
import { tokenService } from 'Main/src/api/v1/services/index.js';
import { ROLES } from 'Main/src/api/v1/config/index.js';

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.UnathorizedError());
    }
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnathorizedError());
    }
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnathorizedError());
    }
    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.UnathorizedError());
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
