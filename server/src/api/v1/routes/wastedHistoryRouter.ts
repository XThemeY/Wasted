import { Router } from 'express';
import { wastedHistoryController } from '#api/v1/controllers/index.js';

const router = Router();

router.get(`/`, wastedHistoryController.getWastedHistory);

export default router;
