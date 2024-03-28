import { Router } from 'express';
import { favoriteController } from '#apiV1/controllers/index.js';

const router = Router();

router.post(`/movies`, favoriteController.setMovieFav);
router.post(`/shows`, favoriteController.setShowFav);
router.post(`/shows/:id/episodes`, favoriteController.setEpisodeFav);

export default router;
