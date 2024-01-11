import Router from 'express';
const router = Router();
import { movieController } from '../controllers';

// controller.addMovie(1);

router.get('/', movieController.getMovieAll);
router.get('/:id', movieController.getMovie);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);

export default router;
