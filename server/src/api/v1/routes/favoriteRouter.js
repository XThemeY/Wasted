import { Router } from 'express';
import { favoriteController } from '#apiV1/controllers/index.js';

const router = Router();
//setMovieFav
router.post(`/movies`, favoriteController.setMovieFav);
router.delete(`/movies`, favoriteController.setMovieFav);

//setShowFav
router.post(`/shows`, favoriteController.setShowFav);
router.delete(`/shows`, favoriteController.setShowFav);

//setEpisodeFav
router.post(`/shows/:id/episodes`, favoriteController.setEpisodeFav);
router.delete(`/shows/:id/episodes`, favoriteController.setEpisodeFav);

export default router;
