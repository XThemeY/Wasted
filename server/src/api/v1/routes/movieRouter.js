import { Router } from 'express';
import { movieController } from '#apiV1/controllers/index.js';
import {
  userDataMiddleware,
  authMiddleware,
  roleMiddleware,
} from '#apiV1/middleware/index.js';
import { ROLES } from '#apiV1/config/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get('/explore', userDataMiddleware, movieController.exploreMovies);
router.get(`/${idRegExp}`, movieController.getMovie);
router.patch(
  `/${idRegExp}`,
  authMiddleware,
  roleMiddleware([ROLES.ADMIN]),
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
