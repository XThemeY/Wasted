import { Router } from 'express';
import {
  episodeController,
  wastedHistoryController,
} from '#api/v1/controllers/index.js';
import {
  authMiddleware,
  ratingValidMiddleware,
  reactionsValidMiddleware,
  roleMiddleware,
  updateValidMiddleware,
  wastedValidMiddleware,
} from '#middleware/index.js';
import { ROLES } from '#config';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(`/${idRegExp}`, episodeController.getEpisode);
router.patch(
  `/update`,
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR]),
  updateValidMiddleware(),
  episodeController.updateEpisode,
);
router.post(
  `/setRating`,
  authMiddleware,
  ratingValidMiddleware(),
  episodeController.setEpisodeRating,
);
router.post(
  `/setReaction`,
  authMiddleware,
  reactionsValidMiddleware(),
  episodeController.setEpisodeReaction,
);

router.post(
  `/setWasted`,
  authMiddleware,
  wastedValidMiddleware(),
  wastedHistoryController.setEpisodeWasted,
);
export default router;
