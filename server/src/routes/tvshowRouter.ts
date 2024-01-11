import Router from 'express';
const router = Router();
import { tvShowController } from '../controllers';

router.get('/', tvShowController.getTVShowAll);
router.get('/:id', tvShowController.getTVShow);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);

export default router;
