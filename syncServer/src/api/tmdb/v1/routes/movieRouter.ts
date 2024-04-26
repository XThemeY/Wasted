import Router from 'express';
import { movieController } from '#api/tmdb/v1/controllers/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(`/${idRegExp}`, movieController.syncMovie);
router.get(`/popular`, movieController.getPopularMovies);
router.get(`/all`, movieController.getMoviesAll);
router.get(`/allabort`, movieController.abortMoviesAll);

export default router;
