import { Router } from 'express';
import { tvShowController } from 'Main/src/api/v1/controllers/index.js';
import { userDataMiddleware, authMiddleware } from 'Main/src/api/v1/middleware/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get('/explore', userDataMiddleware, tvShowController.exploreShows);
router.get(`/${idRegExp}`, tvShowController.getShow);
router.post(
  `/${idRegExp}/rating`,
  authMiddleware,
  tvShowController.setShowRating,
);
export default router;
