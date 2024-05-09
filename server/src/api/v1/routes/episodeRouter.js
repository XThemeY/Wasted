import { Router } from 'express';
import { episodeController } from 'Main/src/api/v1/controllers/index.js';
import { authMiddleware } from 'Main/src/api/v1/middleware/index.js';

const router = Router({ mergeParams: true });
const idRegExp = ':episodeId(\\d+)';

router.get(`/${idRegExp}`, episodeController.getEpisode);
router.post(
  `/${idRegExp}/rating`,
  authMiddleware,
  episodeController.setEpisodeRating,
);
router.post(
  `/${idRegExp}/reaction`,
  authMiddleware,
  episodeController.setEpisodeReaction,
);
export default router;
