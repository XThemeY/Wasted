import Router from 'express';
import {
  authRouter,
  userRouter,
  movieRouter,
  tvshowRouter,
  gameRouter,
  wastedHistoryRouter,
  favoriteRouter,
} from '../../routes/index.js';
import { searchController } from '../../controllers/index.js';
import { authMiddleware, isOwner } from '../../middleware/index.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/movies', movieRouter);
router.use('/shows', tvshowRouter);
router.use('/games', gameRouter);
router.get('/search', searchController.search);
router.use('/', userRouter);
router.use('/:username/favorites/', authMiddleware, isOwner, favoriteRouter);
router.use('/:username/', authMiddleware, isOwner, wastedHistoryRouter);

export default router;
