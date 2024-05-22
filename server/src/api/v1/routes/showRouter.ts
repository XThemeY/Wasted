import { Router } from 'express';
import { tvShowController } from '#api/v1/controllers/index.js';
import {
  cookieParseMiddleware,
  authMiddleware,
  searchValidMiddleware,
} from '#middleware/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(
  '/explore',
  searchValidMiddleware(),
  cookieParseMiddleware,
  tvShowController.exploreShows,
);
router.get(`/${idRegExp}`, tvShowController.getShow);
router.post(
  `/${idRegExp}/rating`,
  authMiddleware,
  tvShowController.setShowRating,
);
export default router;
