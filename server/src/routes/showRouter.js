import Router from 'express';
import { tvShowController } from '../controllers/index.js';

const router = Router();
const idRegExp = ':id(\\d+)/';

router.get('/explore', tvShowController.exploreShows);
router.get(`/${idRegExp}`, tvShowController.getShow);

export default router;
