import { Router } from 'express';
import { tvShowController } from '#api/v1/controllers/index.js';
import {
  cookieParseMiddleware,
  exploreValidMiddleware,
} from '#middleware/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(
  '/explore',
  exploreValidMiddleware(),
  cookieParseMiddleware,
  tvShowController.exploreShows,
);
router.get(`/${idRegExp}`, tvShowController.getShow);

// router.post(
//   `/${idRegExp}/rating`,
//   authMiddleware,
//   tvShowController.setShowRating,
// );
export default router;
