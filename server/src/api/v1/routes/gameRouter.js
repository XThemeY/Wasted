import { Router } from 'express';
import { gameController } from '#apiV1/controllers/index.js';

const router = Router();

// controller.addMovie(1);

router.get('/', gameController.getGameAll);
router.get('/:id', gameController.getGame);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);

export default router;
