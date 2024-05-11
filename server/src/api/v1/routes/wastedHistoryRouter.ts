import { Router } from 'express';
import { wastedHistoryController } from '#api/v1/controllers/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.post(`/movies`, wastedHistoryController.setMovieWasted);
router.post(`/shows`, wastedHistoryController.setShowWasted);
router.post(
  `/shows/${idRegExp}/episodes`,
  wastedHistoryController.setEpisodeWasted,
);

export default router;
