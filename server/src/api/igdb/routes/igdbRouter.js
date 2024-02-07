import Router from 'express';
import IgdbGameAPI from '../controllers/gamesAPIController.js';
const router = Router();

const idRegExp = ':id(\\d+)';

router.post(`/game/${idRegExp}`, IgdbGameAPI.getGame);
router.post(`/game/search`, IgdbGameAPI.searchGames);

export default router;
