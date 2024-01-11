import Router from 'express';
const router = Router();
import { userController } from '../controllers/';
import { authMiddleware, isOwner } from '../middleware';

router.get('/users', userController.getUserAll);
router.get('/:username', authMiddleware, userController.getUser);
router.patch('/:username', authMiddleware, isOwner, userController.updateUser);

export default router;
