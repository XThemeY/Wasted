import { Router } from 'express';
import { seasonController } from '#api/v1/controllers/index.js';
import { ROLES } from '#config';
import {
  authMiddleware,
  roleMiddleware,
  updateValidMiddleware,
} from '#middleware';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(`/${idRegExp}`, seasonController.getSeason);
router.post(
  `/${idRegExp}`,
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR]),
  seasonController.markSeason,
);
router.patch(
  `/${idRegExp}`,
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR]),
  updateValidMiddleware(),
  seasonController.updateSeason,
);

export default router;
