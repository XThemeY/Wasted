import { Router } from 'express';
import {
  seasonController,
  wastedHistoryController,
} from '#api/v1/controllers/index.js';
import { ROLES } from '#config';
import {
  authMiddleware,
  roleMiddleware,
  updateValidMiddleware,
  wastedValidMiddleware,
} from '#middleware';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(`/${idRegExp}`, seasonController.getSeason);
router.patch(
  `/update`,
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR]),
  updateValidMiddleware(),
  seasonController.updateSeason,
);
router.post(
  `/setWasted`,
  authMiddleware,
  wastedValidMiddleware(),
  wastedHistoryController.setSeasonWasted,
);

export default router;
