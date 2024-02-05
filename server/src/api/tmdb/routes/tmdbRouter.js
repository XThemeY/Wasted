import Router from 'express';
import { tmdbMovieAPI, tmdbShowAPI } from '../controllers/index.js';
const router = Router();

const idRegExp = ':id(\\d+)';

router.get(`/movie/${idRegExp}`, tmdbMovieAPI.getMovie);
router.get(`/movie/popular`, tmdbMovieAPI.getPopularMovies);
router.get(`/show/${idRegExp}`, tmdbShowAPI.getShow);
router.get(`/show/popular`, tmdbShowAPI.getPopularShows);

export default router;
