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

router.get(`/${idRegExp}`, tvShowController.getShow);
router.patch(
  `/${idRegExp}`,
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR]),
  updateValidMiddleware(),
  tvShowController.updateShow,
);
router.get(
  '/explore',
  exploreValidMiddleware(),
  cookieParseMiddleware,
  tvShowController.exploreShows,
);
router.post(
  `/${idRegExp}/favorites`,
  authMiddleware,
  favValidMiddleware(),
  favoriteController.setShowFav,
);
router.post(
  `/${idRegExp}/wasted`,
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
