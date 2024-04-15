import { tokenService } from 'Main/src/api/v1/services/index.js';

export async function userDataMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader.split(' ')[1];
    const userData = tokenService.validateAccessToken(accessToken);

    req.user = userData;
    next();
  } catch (e) {
    next();
  }
}
