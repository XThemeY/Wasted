import Router from 'express';
import { tmdbMovieAPI, tmdbShowAPI } from '#api/tmdb/controllers/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(`/movie/${idRegExp}`, tmdbMovieAPI.getMovie);
router.get(`/movie/popular`, tmdbMovieAPI.getPopularMovies);
router.get(`/show/${idRegExp}`, tmdbShowAPI.getShow);
router.get(`/show/popular`, tmdbShowAPI.getPopularShows);
router.get(`/movie/all`, tmdbMovieAPI.getMoviesAll);
router.get(`/movie/allabort`, tmdbMovieAPI.abortMoviesAll);
router.get(`/show/all`, tmdbShowAPI.getShowsAll);
router.get(`/show/allabort`, tmdbShowAPI.abortShowsAll);

export default router;
