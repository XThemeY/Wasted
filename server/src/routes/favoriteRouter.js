import Router from 'express';
const router = Router();
import { favoriteController } from '../controllers/index.js';

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
