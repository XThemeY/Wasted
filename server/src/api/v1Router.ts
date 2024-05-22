import { Router } from 'express';
import {
  authRouter,
  userRouter,
  movieRouter,
  tvshowRouter,
  seasonRouter,
  wastedHistoryRouter,
  favoriteRouter,
  episodeRouter,
  commentRouter,
} from '#api/v1/routes/index.js';
import { searchController } from '#api/v1/controllers/index.js';
import {
  authMiddleware,
  isOwner,
  cookieParseMiddleware,
} from '#middleware/index.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/movies', movieRouter);
router.use('/shows', tvshowRouter);
router.use('/comments', cookieParseMiddleware, commentRouter);
router.use(`/seasons`, seasonRouter);
router.use(`/episodes`, episodeRouter);
// router.use('/games', gameRouter);
router.get('/search', searchController.search);
router.use('/', userRouter);
router.use('/:username/favorites', authMiddleware, isOwner, favoriteRouter);
router.use('/:username', authMiddleware, isOwner, wastedHistoryRouter);

export default router;