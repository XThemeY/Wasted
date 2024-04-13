import { Router } from 'express';
import { favoriteController } from '#apiV1/controllers/index.js';

const router = Router();
// const idRegExp = ':id(\\d+)';

router.post(`/movies`, favoriteController.setMovieFav);
router.post(`/shows`, favoriteController.setShowFav);
router.post(`/episodes`, favoriteController.setEpisodeFav);

export default router;
