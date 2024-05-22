import { Router } from 'express';
import { wastedHistoryController } from '#api/v1/controllers/index.js';

const router = Router();

router.get(`/wasted`, wastedHistoryController.getWastedHistory);
router.post(`/movies`, wastedHistoryController.setMovieWasted);
router.post(`/shows`, wastedHistoryController.setShowWasted);
router.post(`/episodes`, wastedHistoryController.setEpisodeWasted);

export default router;
