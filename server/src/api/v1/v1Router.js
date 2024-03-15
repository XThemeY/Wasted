import { Router } from 'express';
import {
  authRouter,
  userRouter,
  movieRouter,
  tvshowRouter,
  gameRouter,
  wastedHistoryRouter,
  favoriteRouter,
  episodeRouter,
} from '#apiV1/routes/index.js';
import { searchController } from '#apiV1/controllers/index.js';
import { authMiddleware, isOwner } from '#apiV1/middleware/index.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/movies', movieRouter);
router.use('/shows', tvshowRouter);
router.use('/shows/:id/episodes', episodeRouter);
router.use('/games', gameRouter);
router.get('/search', searchController.search);
router.use('/', userRouter);
router.use('/:username/favorites/', authMiddleware, isOwner, favoriteRouter);
router.use('/:username/', authMiddleware, isOwner, wastedHistoryRouter);

export default router;
