import { Router } from 'express';
import {
  favoriteController,
  tvShowController,
  wastedHistoryController,
} from '#api/v1/controllers/index.js';
import {
  authMiddleware,
  cookieParseMiddleware,
  exploreValidMiddleware,
  favValidMiddleware,
  roleMiddleware,
  updateValidMiddleware,
  wastedValidMiddleware,
} from '#middleware/index.js';
import { ROLES } from '#config';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(
  '/explore',
  exploreValidMiddleware(),
  cookieParseMiddleware,
  tvShowController.exploreShows,
);
router.get(`/${idRegExp}`, tvShowController.getShow);

router.post(
  `/setFavorite`,
  authMiddleware,
  favValidMiddleware(),
  favoriteController.setShowFav,
);

router.patch(
  `/update`,
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR]),
  updateValidMiddleware(),
  tvShowController.updateShow,
);
router.post(
  `/setWasted`,
  authMiddleware,
  wastedValidMiddleware(),
  wastedHistoryController.setMediaWasted,
);
// router.post(
//   `/${idRegExp}/rating`,
//   authMiddleware,
//   tvShowController.setShowRating,
// );
export default router;
