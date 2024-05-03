import Router from 'express';
import { showController } from '#api/tmdb/v1/controllers/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(`/${idRegExp}`, showController.addShow);
router.patch(`/${idRegExp}`, showController.syncShow);
router.get(`/popular`, showController.getPopularShows);
router.get(`/all`, showController.syncShowsAll);
router.get(`/allabort`, showController.abortShowsAll);

export default router;
