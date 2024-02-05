import Router from 'express';
import IgdbGameAPI from '../controllers/gamesAPIController.js';
const router = Router();

const idRegExp = ':id(\\d+)';

router.get(`/game/${idRegExp}`, IgdbGameAPI.getGame);
router.get(`/game/search`, IgdbGameAPI.searchGames);

export default router;
