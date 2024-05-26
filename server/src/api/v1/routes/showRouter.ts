import { Router } from 'express';
import { tvShowController } from '#api/v1/controllers/index.js';
import {
  authMiddleware,
  cookieParseMiddleware,
  exploreValidMiddleware,
  roleMiddleware,
  updateValidMiddleware,
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
router.patch(
  `/${idRegExp}`,
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR]),
  updateValidMiddleware(),
  tvShowController.updateShow,
);

// router.post(
//   `/${idRegExp}/rating`,
//   authMiddleware,
//   tvShowController.setShowRating,
// );
export default router;
