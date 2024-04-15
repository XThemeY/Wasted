import { Router } from 'express';
import { authController } from 'Main/src/api/v1/controllers/index.js';
import { registerMiddleware } from 'Main/src/api/v1/middleware/index.js';

const router = Router();
router.post('/registration', registerMiddleware(), authController.registration);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.get('/activate/:link', authController.activate);

export default router;
