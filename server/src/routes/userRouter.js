import Router from 'express';
const router = Router();
import { userController } from '../controllers/index.js';
import { authMiddleware, isOwner } from '../middleware/index.js';

router.get('/:username', authMiddleware, userController.getUser);
router.patch('/:username', authMiddleware, isOwner, userController.updateUser);
router.put(
  `/:username/movies`,
  authMiddleware,
  isOwner,
  userController.setMovieToWasted,
);
router.put(
  `/:username/shows`,
  authMiddleware,
  isOwner,
  userController.setShowToWasted,
);
router.put(
  `/:username/favorites/movies`,
  authMiddleware,
  isOwner,
  userController.setMovieToFav,
);
router.put(
  `/:username/favorites/shows`,
  authMiddleware,
  isOwner,
  userController.setShowToFav,
);

export default router;
