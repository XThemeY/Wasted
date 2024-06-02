import type { IJwtPayload } from '#interfaces/IFields';
import ApiError from '#utils/apiError';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function roleMiddleware(roles: string[]) {
  return function (req: Request, res: Response, next: NextFunction): void {
    if (req.method === 'OPTIONS') {
      next();
    }
    try {
      const token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return next(ApiError.Forbidden());
      }
      const { userRoles } = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
      ) as IJwtPayload;
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return next(ApiError.Forbidden());
      }
      return next();
    } catch (e) {
      return next(ApiError.Forbidden());
    }
  };
}
