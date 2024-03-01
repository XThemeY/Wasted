import tokenService from '../../services/tokenService.js';

export default async function (req, res, next) {
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
