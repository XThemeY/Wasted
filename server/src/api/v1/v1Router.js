import Router from 'express';
import {
  authRouter,
  userRouter,
  movieRouter,
  tvshowRouter,
  gameRouter,
} from '../../routes/index.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/movies', movieRouter);
router.use('/shows', tvshowRouter);
router.use('/games', gameRouter);
router.use('/', userRouter);
export default router;
