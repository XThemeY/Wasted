import ApiError from '#utils/apiError.js';
import { tokenService } from '#apiV1/services/index.js';

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
    if (!currentUserName) {
      return next(ApiError.Forbidden());
    }

    if (currentUserName !== username) {
      return next(ApiError.Forbidden());
    }

    next();
  } catch (e) {
    return next(ApiError.Forbidden());
  }
}
