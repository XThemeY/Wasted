import Router from 'express';
import { movieController } from '../controllers/index.js';
const router = Router();

router.get('/', movieController.getMovieAll);
router.get('/:id(\\d+)/', movieController.getMovie);

export default router;
