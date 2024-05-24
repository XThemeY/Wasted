import { Router } from 'express';
import { wastedHistoryController } from '#api/v1/controllers/index.js';

const router = Router();

router.get(`/wasted`, wastedHistoryController.getWastedHistory);
router.post(`/movies`, wastedHistoryController.setMediaWasted);
router.post(`/shows`, wastedHistoryController.setMediaWasted);
router.post(`/episodes`, wastedHistoryController.setMediaWasted);

export default router;
