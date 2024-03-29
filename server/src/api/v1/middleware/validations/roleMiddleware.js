import jwt from 'jsonwebtoken';

export function roleMiddleware(roles) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }
    try {
      const token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(403).json({
          message: `Пользователь не авторизован`,
        });
      }
      const { userRoles } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return res.status(403).json({
          message: `У вас нет доступа`,
        });
      }
      next();
    } catch (e) {
      return res.status(403).json({
        message: `Пользователь не авторизован`,
      });
    }
  };
}
