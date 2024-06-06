import { Router } from 'express';
import {
  authRouter,
  userRouter,
  movieRouter,
  tvshowRouter,
  seasonRouter,
  episodeRouter,
  commentRouter,
  uploadRouter,
} from '#api/v1/routes/index.js';
import { searchController } from '#api/v1/controllers/index.js';
import { cookieParseMiddleware } from '#middleware/index.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/movies', movieRouter);
router.use('/shows', tvshowRouter);
router.use(`/seasons`, seasonRouter);
router.use(`/episodes`, episodeRouter);
router.use('/comments', cookieParseMiddleware, commentRouter);
// router.use('/games', gameRouter);
router.get('/search', searchController.search);
router.use('/upload', uploadRouter);
router.use('/', userRouter);
export default router;
