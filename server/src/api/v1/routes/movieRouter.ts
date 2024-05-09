import { Router } from 'express';
import { movieController } from '#api/v1/controllers/index.js';
import {
  userDataMiddleware,
  authMiddleware,
  roleMiddleware,
} from '#middleware/index.js';
import { ROLES } from '#config/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get('/explore', userDataMiddleware, movieController.exploreMovies);
router.get(`/${idRegExp}`, movieController.getMovie);
router.patch(
  `/${idRegExp}`,
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR]),
  movieController.updateMovie,
);
router.post(
  `/${idRegExp}/rating`,
  authMiddleware,
  movieController.setMovieRating,
);

router.post(
  `/${idRegExp}/reaction`,
  authMiddleware,
  movieController.setMovieReaction,
);

//router.post(idRegExp, movieController.addMovie);

export default router;
