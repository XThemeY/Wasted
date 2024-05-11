import { Router } from 'express';
import { authController } from '#api/v1/controllers/index.js';
import {
  registerValidMiddleware,
  loginValidMiddleware,
  tokenValidMiddleware,
} from '#middleware/index.js';

const router = Router();
router.post(
  '/registration',
  registerValidMiddleware(),
  authController.registration,
);
router.post('/login', loginValidMiddleware(), authController.login);
router.post('/logout', tokenValidMiddleware(), authController.logout);
router.post('/refresh', tokenValidMiddleware(), authController.refresh);
router.get('/activate/:link', authController.activate);

export default router;
