import { Router } from 'express';
import { seasonController } from '#api/v1/controllers/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(`/${idRegExp}`, seasonController.getSeason);

export default router;
