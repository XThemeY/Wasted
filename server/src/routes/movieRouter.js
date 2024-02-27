import Router from 'express';
import { movieController } from '../controllers/index.js';

const router = Router();
const idRegExp = ':id(\\d+)/';

router.get('/explore', movieController.exploreMovies);
router.get(`/${idRegExp}`, movieController.getMovie);

//router.post(idRegExp, movieController.addMovie);
//router.patch(idRegExp, movieController.updateMovie);

//router.get(idRegExp, movieController.getMovie);
//router.get(idRegExp, movieController.getMovie);

export default router;
