import Router from 'express';
import { tvShowController } from '../controllers/index.js';
import { userDataMiddleware } from '../middleware/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get('/explore', userDataMiddleware, tvShowController.exploreShows);
router.get(`/${idRegExp}`, tvShowController.getShow);

export default router;
