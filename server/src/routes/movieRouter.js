import Router from 'express';
import { movieController } from '../controllers/index.js';

const router = Router();

const idRegExp = ':id(\\d+)/';

router.get('/', movieController.getMovieAll);

router.get(`/${idRegExp}`, movieController.getMovie);
router.get('/search', movieController.searchMovie);

//router.post(idRegExp, movieController.addMovie);
//router.patch(idRegExp, movieController.updateMovie);

//router.get(idRegExp, movieController.getMovie);
//router.get(idRegExp, movieController.getMovie);

export default router;
