import { Router } from 'express';
import {
  episodeController,
  favoriteController,
  wastedHistoryController,
} from '#api/v1/controllers/index.js';
import {
  authMiddleware,
  favValidMiddleware,
  isOwner,
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
  `/${idRegExp}`,
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR]),
  updateValidMiddleware(),
  episodeController.updateEpisode,
);
router.post(
  `/${idRegExp}/ratings`,
  authMiddleware,
  ratingValidMiddleware(),
  episodeController.setEpisodeRating,
);
router.post(
  `/${idRegExp}/reactions`,
  authMiddleware,
  reactionsValidMiddleware(),
  episodeController.setEpisodeReaction,
);
router.post(
  `/${idRegExp}/wasted`,
  authMiddleware,
  wastedValidMiddleware(),
  wastedHistoryController.setEpisodeWasted,
);
router.post(
  `/${idRegExp}/favorites`,
  authMiddleware,
  favValidMiddleware(),
  favoriteController.setEpisodeFav,
);
router.delete(
  `/${idRegExp}/favorites`,
  authMiddleware,
  isOwner,
  favValidMiddleware(),
  favoriteController.delEpisodeFav,
);
export default router;
