import { Router } from 'express';
import { gameController } from '#api/v1/controllers/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get('/', gameController.getGameAll);
router.get(`/${idRegExp}`, gameController.getGame);

export default router;