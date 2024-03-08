import Router from 'express';
import { authController } from '../controllers/index.js';
import registerMiddleware from '../middleware/validations/registerMiddleware.js';
const router = Router();

router.post('/registration', registerMiddleware(), authController.registration);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.get('/activate/:link', authController.activate);

export default router;
