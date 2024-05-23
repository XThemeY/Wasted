import MovieService from '#api/tmdb/v1/services/movieService.js';
import ShowService from '#api/tmdb/v1/services/showService.js';
import RequestHandler from '#api/ApiConfigs.js';
import { logger } from '#middleware/index.js';
import { logNames } from '#config/index.js';

const syncLogger = logger(logNames.autoSync).child({ module: 'autoSync' });
const dayInterval = 1000 * 60 * 60 * 24;

async function autoMovieSync(): Promise<void> {
  try {
    const startWastedId = (await MovieService.getLastMovieTMDBId()) + 1;
    const latestTMDBId = (await RequestHandler.reqLatestMedia('movie')).data.id;
    for (let i = startWastedId; i <= latestTMDBId; i++) {
      try {
        const response = await RequestHandler.reqMedia('movie', i);
        const responseENG = await RequestHandler.reqMedia(
          'movie',
          i,
          true,
          false,
        );
        await MovieService.addMovieToDb(
          response.data,
          responseENG.data,
          latestTMDBId,
        );
      } catch (error) {
        syncLogger.error(
          `ID:${i} Ошибка запроса фильма - ${error?.message}`,
          error,
        );
      }
    }
    syncLogger.info(`Все фильмы добавлены`);
  } catch (error) {
    syncLogger.error(error?.message);
  }
}

async function autoShowSync(): Promise<void> {
  try {
    const startWastedId = (await ShowService.getLastShowId()) + 1;
    const latestTMDBId = (await RequestHandler.reqLatestMedia('tv')).data.id;
    for (let i = startWastedId; i <= latestTMDBId; i++) {
      try {
        const response = await RequestHandler.reqMedia('tv', i);
        const responseENG = await RequestHandler.reqMedia('tv', i, true);
        await ShowService.addShowToDb(
          response.data,
          responseENG.data,
          latestTMDBId,
        );
      } catch (error) {
        syncLogger.error(
          `ID:${i} Ошибка запроса шоу - ${error?.message}`,
          error,
        );
      }
    }
    syncLogger.info(`Все шоу добавлены`);
  } catch (error) {
    syncLogger.error(error?.message);
  }
}
autoMovieSync();
setTimeout(async () => {
  await autoMovieSync();
}, dayInterval);
autoShowSync();
setTimeout(async () => {
  await autoShowSync();
}, dayInterval);
