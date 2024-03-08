import Router from 'express';
const router = Router();
import { wastedHistoryController } from '../controllers/index.js';

const idRegExp = ':id(\\d+)';

//setMovieWasted
router.post(`/movies`, wastedHistoryController.setMovieWasted);
router.delete(`/movies`, wastedHistoryController.setMovieWasted);

//setShowWasted
router.post(`/shows`, wastedHistoryController.setShowWasted);
router.delete(`/shows`, wastedHistoryController.setShowWasted);

//setEpisodeWasted
router.post(
  `/shows/${idRegExp}/episodes`,
  wastedHistoryController.setEpisodeWasted,
);
router.delete(
  `/shows/${idRegExp}/episodes`,
  wastedHistoryController.setEpisodeWasted,
);

export default router;
