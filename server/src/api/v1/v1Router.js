import Router from 'express';
import {
  authRouter,
  userRouter,
  movieRouter,
  tvshowRouter,
  gameRouter,
} from '../../routes/index.js';
import { searchController } from '../../controllers/index.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/movies', movieRouter);
router.use('/shows', tvshowRouter);
router.use('/games', gameRouter);
//router.use('/users', userRouter);
router.get('/search', searchController.search);
router.use('/', userRouter);

export default router;
