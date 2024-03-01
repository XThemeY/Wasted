import Router from 'express';
import { authController } from '../controllers/index.js';
import { body } from 'express-validator';
const router = Router();

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 8, max: 32 }),
  body('username').isLength({ min: 3, max: 15 }),
  authController.registration,
);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.get('/activate/:link', authController.activate);

export default router;
