import { Router } from 'express';
import { userController } from '#api/v1/controllers/index.js';
import { authMiddleware, isOwner } from '#middleware/index.js';

const router = Router();

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
