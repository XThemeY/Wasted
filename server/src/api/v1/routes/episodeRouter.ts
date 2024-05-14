import { Router } from 'express';
import { episodeController } from '#api/v1/controllers/index.js';
import {
  authMiddleware,
  ratingValidMiddleware,
  reactionsValidMiddleware,
} from '#middleware/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(`/${idRegExp}`, episodeController.getEpisode);
router.post(
  `/${idRegExp}/rating`,
  authMiddleware,
  ratingValidMiddleware(),
  episodeController.setEpisodeRating,
);
router.post(
  `/${idRegExp}/reaction`,
  authMiddleware,
  reactionsValidMiddleware(),
  episodeController.setEpisodeReaction,
);
export default router;
