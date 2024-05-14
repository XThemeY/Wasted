import { Router } from 'express';
import { seasonController } from '#api/v1/controllers/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(`/${idRegExp}`, seasonController.getSeason);
// router.post(
//   `/${idRegExp}/rating`,
//   authMiddleware,
//   ratingValidMiddleware(),
//   seasonController.setEpisodeRating,
// );
// router.post(
//   `/${idRegExp}/reaction`,
//   authMiddleware,
//   reactionsValidMiddleware(),
//   seasonController.setEpisodeReaction,
// );
export default router;
