import { Router } from 'express';
import { favoriteController } from '#api/v1/controllers/index.js';

const router = Router();
// const idRegExp = ':id(\\d+)';

router.get(`/`, favoriteController.getFavorites);

export default router;
