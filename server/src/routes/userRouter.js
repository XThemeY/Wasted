import Router from 'express';
const router = Router();
import { userController } from '../controllers/index.js';
import { authMiddleware, isOwner } from '../middleware/index.js';
const idRegExp = ':id(\\d+)';

router.get('/users/', userController.getAllUsers);
router.get('/:username', userController.getUser);
//UserSettings
router.get(
  `/:username/settings`,
  authMiddleware,
  isOwner,
  userController.getUserSettings,
);
router.patch(
  `/:username/settings`,
  authMiddleware,
  isOwner,
  userController.setUserSettings,
);

export default router;
