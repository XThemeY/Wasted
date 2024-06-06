import { Router } from 'express';
import {
  favoriteController,
  movieController,
  wastedHistoryController,
} from '#api/v1/controllers/index.js';
import {
  cookieParseMiddleware,
  exploreValidMiddleware,
  ratingValidMiddleware,
  updateValidMiddleware,
  reactionsValidMiddleware,
  authMiddleware,
  roleMiddleware,
  wastedValidMiddleware,
  favValidMiddleware,
} from '#middleware/index.js';
import { ROLES } from '#config/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(`/${idRegExp}`, movieController.getMovie);
router.patch(
  `/${idRegExp}`,
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR]),
  updateValidMiddleware(),
  movieController.updateMovie,
);
router.get(
  '/explore',
  exploreValidMiddleware(),
  cookieParseMiddleware,
  movieController.exploreMovies,
);

router.post(
  `/${idRegExp}/favorites`,
  authMiddleware,
  favValidMiddleware(),
  favoriteController.setMovieFav,
);
router.delete(
  `/${idRegExp}/favorites`,
  authMiddleware,
  favValidMiddleware(),
  favoriteController.delMovieFav,
);

router.post(
  `/${idRegExp}/ratings`,
  authMiddleware,
  ratingValidMiddleware(),
  movieController.setMovieRating,
);

router.post(
  `/${idRegExp}/reactions`,
  authMiddleware,
  reactionsValidMiddleware(),
  movieController.setMovieReaction,
);

router.post(
  `/${idRegExp}/wasted`,
  authMiddleware,
  wastedValidMiddleware(),
  wastedHistoryController.setMediaWasted,
);

export default router;
