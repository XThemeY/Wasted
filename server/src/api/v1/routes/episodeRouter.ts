import { Router } from 'express';
import { episodeController } from '#api/v1/controllers/index.js';
import {
  authMiddleware,
  ratingValidMiddleware,
  reactionsValidMiddleware,
  roleMiddleware,
  updateValidMiddleware,
} from '#middleware/index.js';
import { ROLES } from '#config';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(`/${idRegExp}`, episodeController.getEpisode);
router.patch(
  `/${idRegExp}`,
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR]),
  updateValidMiddleware(),
  episodeController.updateEpisode,
);
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
