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

router.get(
  '/explore',
  exploreValidMiddleware(),
  cookieParseMiddleware,
  movieController.exploreMovies,
);
router.get(`/${idRegExp}`, movieController.getMovie);
router.post(
  `/setFavorite`,
  authMiddleware,
  favValidMiddleware(),
  favoriteController.setMovieFav,
);
router.patch(
  `/update`,
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR]),
  updateValidMiddleware(),
  movieController.updateMovie,
);
router.post(
  `/setRating`,
  authMiddleware,
  ratingValidMiddleware(),
  movieController.setMovieRating,
);

router.post(
  `/setReaction`,
  authMiddleware,
  reactionsValidMiddleware(),
  movieController.setMovieReaction,
);

router.post(
  `/setWasted`,
  authMiddleware,
  wastedValidMiddleware(),
  wastedHistoryController.setMediaWasted,
);

export default router;
