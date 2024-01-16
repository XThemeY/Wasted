import Router from 'express'
const router = Router()
import { gameController } from '../controllers/index.js'

// controller.addMovie(1);

router.get('/', gameController.getGameAll)
router.get('/:id', gameController.getGame)
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);

export default router
