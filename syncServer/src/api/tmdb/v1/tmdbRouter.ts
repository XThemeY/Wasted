import { Router } from 'express';
import { movieRouter, tvshowRouter } from '#api/tmdb/v1/routes/index.js';

//import { authMiddleware } from 'Main/src/api/v1/middleware/index.js';

const router = Router();
//const idRegExp = ':id(\\d+)';

//router.use('/auth', authRouter);
router.use('/movies', movieRouter);
router.use('/shows', tvshowRouter);
//router.use(`/shows/${idRegExp}/episodes`, episodeRouter);

export default router;

// //https://rating.kinopoisk.ru/404900.xml
