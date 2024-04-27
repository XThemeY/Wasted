import Router from 'express';
import { showController } from '#api/tmdb/v1/controllers/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(`/show/${idRegExp}`, showController.getShow);
// router.get(`/show/popular`, showController.getPopularShows);
router.get(`/show/all`, showController.getShowsAll);
router.get(`/show/allabort`, showController.abortShowsAll);

export default router;
