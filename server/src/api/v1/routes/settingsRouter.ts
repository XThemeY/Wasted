import { Router } from 'express';
import { userController } from '#api/v1/controllers/index.js';

const router = Router();

//UserSettings
router.get(`/`, userController.getUserSettings);
router.patch(`/`, userController.setUserSettings);

export default router;
