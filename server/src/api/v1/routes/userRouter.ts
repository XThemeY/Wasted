import { Router } from 'express';
import {
  commentController,
  userController,
} from '#api/v1/controllers/index.js';
import { authMiddleware, isProfileOwner } from '#middleware/index.js';
import {
  favoriteRouter,
  settingsRouter,
  wastedHistoryRouter,
} from '#api/v1/routes/index.js';

const router = Router();
const username = `:username`;

router.get('/users/', isProfileOwner, userController.getAllUsers);
router.get(`/${username}`, isProfileOwner, userController.getUser);
router.get(
  `/${username}/comments`,
  isProfileOwner,
  commentController.getUserComments,
);
router.use(
  `/${username}/settings`,
  authMiddleware,
  isProfileOwner,
  settingsRouter,
);
router.use(
  `/${username}/favorites`,
  authMiddleware,
  isProfileOwner,
  favoriteRouter,
);
router.use(
  `/${username}/wasted`,
  authMiddleware,
  isProfileOwner,
  wastedHistoryRouter,
);

export default router;
