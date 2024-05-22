import { Router } from 'express';
import { movieController } from '#api/v1/controllers/index.js';
import {
  cookieParseMiddleware,
  searchValidMiddleware,
  ratingValidMiddleware,
  updateValidMiddleware,
  reactionsValidMiddleware,
  authMiddleware,
  roleMiddleware,
} from '#middleware/index.js';
import { ROLES } from '#config/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(
  '/explore',
  searchValidMiddleware(),
  cookieParseMiddleware,
  movieController.exploreMovies,
);
router.get(`/${idRegExp}`, movieController.getMovie);
router.patch(
  `/${idRegExp}`,
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR]),
  updateValidMiddleware(),
  movieController.updateMovie,
);
router.post(
  `/${idRegExp}/rating`,
  authMiddleware,
  ratingValidMiddleware(),
  movieController.setMovieRating,
);

router.post(
  `/${idRegExp}/reaction`,
  authMiddleware,
  reactionsValidMiddleware(),
  movieController.setMovieReaction,
);

export default router;
