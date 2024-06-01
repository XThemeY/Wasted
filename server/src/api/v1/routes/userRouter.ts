import { Router } from 'express';
import {
  commentController,
  userController,
} from '#api/v1/controllers/index.js';
import { authMiddleware, isOwner } from '#middleware/index.js';
import {
  settingsRouter,
  favoriteRouter,
  wastedHistoryRouter,
} from './index.js';

const router = Router();
const username = `:username`;

router.get('/users/', userController.getAllUsers);
router.get(`/${username}`, userController.getUser);
router.get(
  `/${username}/comments`,
  authMiddleware,
  commentController.getUserComments,
);

router.use(`/${username}/settings`, authMiddleware, isOwner, settingsRouter);
router.use(`/${username}/favorites`, authMiddleware, isOwner, favoriteRouter);
router.use(`/${username}/wasted`, authMiddleware, isOwner, wastedHistoryRouter);

export default router;
