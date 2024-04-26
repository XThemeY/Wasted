import { tmdbApiConfig } from '#/api/ApiConfigs.js';
import MovieService from '#api/tmdb/v1/services/movieService.js';
import { Movie } from '#db/models/index.js';
import { Request, Response, NextFunction } from 'express';

const axiosMovie = tmdbApiConfig();
let abort = false;

class TmdbMovieAPI {
  async addMovie(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const movieId = req.params.id;

    try {
      const response = await axiosMovie.get(
        '/movie/' +
          movieId +
          '?language=ru-RU&append_to_response=keywords,credits,images&include_image_language=ru,en',
      );
      const responseENG = await axiosMovie.get(
        '/movie/' + movieId + '?language=en-US',
      );
      await MovieService.addMovieToDb(response.data, responseENG.data);
      return res.status(200).json({ message: 'Movie added' });
    } catch (error) {
      return next(error);
    }
  }

  async syncMovie(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const movieId = req.params.id;
    try {
      const response = await axiosMovie.get(
        '/movie/' +
          movieId +
          '?language=ru-RU&append_to_response=keywords,credits,images&include_image_language=ru,en',
      );
      await MovieService.syncMovie(response.data);
      return res.status(200).json({ message: 'Movie added' });
    } catch (error) {
      return next(error);
    }
  }

  async syncRatings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const movieId = req.params.id;
    try {
      const response = await axiosMovie.get(
        '/movie/' +
          movieId +
          '?language=ru-RU&append_to_response=keywords,credits,images&include_image_language=ru,en',
      );
      const { updatedAt } = await MovieService.getMovie(response.data.id);
      const tomorrow = new Date(updatedAt as Date);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      const now = new Date();
      if (tomorrow < now) {
        await MovieService.syncRatings(response.data);
      }
      return res.status(200).json({ message: 'Movie rating synced' });
    } catch (error) {
      return next(error);
    }
  }

  async getPopularMovies(req: Request, res: Response): Promise<void> {
    const pages = +req.query.pages;
    const popularIDs = [];
    try {
      for (let page = 1; page <= pages; page++) {
        const response = await axiosMovie.get(
          '/discover/movie' +
            '?language=ru-RU&page=' +
            page +
            '&sort_by=popularity.desc&vote_count.gte=100',
        );
        for (const item of response.data.results) {
          popularIDs.push(item.id);
        }
      }
      res.json(popularIDs);
      for (const item of popularIDs) {
        const newResponse = await axiosMovie.get(
          '/movie/' +
            item +
            '?language=ru-RU&append_to_response=keywords,credits,images&include_image_language=ru,en',
        );
        const responseENG = await axiosMovie.get(
          '/movie/' + item + '?language=en-US',
        );
        await MovieService.addMovieToDb(newResponse.data, responseENG.data);
      }
      console.log(`Список популярных фильмов получен`);
    } catch (error) {
      // logEvents(
      //   `${error?.name || error}: ${error?.message || error}`,
      //   'movieReqLog.log',
      // );
      console.log(
        `Ошибка получения популярных фильмов`,
        error?.message || error,
      );
    }
  }

  async getMoviesAll(req: Request, res: Response): Promise<void> {
    let latestTMDBId = 0;
    let latestWastedId = 0;
    abort = false;
    try {
      const lastMovieId = await Movie.findOne().sort({ $natural: -1 });
      if (lastMovieId) {
        latestWastedId = +lastMovieId.external_ids.tmdb + 1;
      }
      const response = await axiosMovie.get('/movie/latest');
      latestTMDBId = response.data.id;
    } catch (error) {
      console.log(`Ошибка запроса LatestTMDBID`);
    }

    for (let i = latestWastedId; i <= latestTMDBId; i++) {
      if (abort) break;
      try {
        const response = await axiosMovie.get(
          '/movie/' +
            i +
            '?language=ru-RU&append_to_response=external_ids,keywords,credits,images&include_image_language=ru,en',
        );

        const responseENG = await axiosMovie.get(
          '/movie/' + i + '?language=en-US',
        );
        await MovieService.addMovieToDb(
          response.data,
          responseENG.data,
          latestTMDBId,
        );
      } catch (error) {
        // logEvents(
        //   `${'id:' + i + '-' + error?.name || error}: ${error?.message || error}`,
        //   'movieReqLog.log',
        // );
        console.log(`ID:${i} Ошибка запроса фильма`, error?.message || error);
        //if (error?.response?.status !== 404) break;
      }
    }
    res.json({ isOk: true });
    console.log(`Все фильмы добавлены`);
  }

  async abortMoviesAll(req: Request, res: Response): Promise<void> {
    abort = true;
    console.log(`Получение всех фильмов отменено`);
    res.json({ msg: 'Aborted' });
  }
}
export default new TmdbMovieAPI();
