import Router from 'express';
const router = Router();
import { userController } from '../controllers/index.js';
import { authMiddleware, isOwner } from '../middleware/index.js';

router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:username', authMiddleware, userController.getUser);
router.patch('/:username', authMiddleware, isOwner, userController.updateUser);

export default router;
