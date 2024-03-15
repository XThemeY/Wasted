import { Episode, Movie, TVShow, WastedHistory } from '#db/models/index.js';
import {
  movieService,
  showService,
  episodeService,
} from '#apiV1/services/index.js';
import ApiError from '#utils/apiError.js';

class WastedHistoryService {
  async setMovieWasted(username, movieId, status) {
    const isMovieExists = await Movie.exists({
      id: movieId,
    });
    if (!isMovieExists) {
      throw ApiError.BadRequest(`Фильма с таким id:${movieId} не существует`);
    }
    const isWasted = await WastedHistory.findOne(
      {
        username,
        'movies.itemId': movieId,
      },
      { 'movies.$': movieId },
    ).exec();

    if (!isWasted) {
      await WastedHistory.updateOne(
        { username },
        {
          $push: {
            movies: [
              {
                itemId: movieId,
                status,
                watchCount: 1,
              },
            ],
          },
        },
        { upsert: true, runValidators: true },
      );
      await movieService.setWatchCount(movieId);
      return;
    }
    if (status === isWasted?.movies[0].status) {
      throw ApiError.BadRequest(`Объект уже имеет статус "${status}"`);
    }
    await WastedHistory.updateOne(
      { username, 'movies.itemId': movieId },
      { 'movies.$.status': status },
      { runValidators: true },
    );
    await movieService.setWatchCount(movieId);
  }

  async setShowWasted(username, showId, status) {
    const isShowExists = await TVShow.exists({
      id: showId,
    });
    if (!isShowExists) {
      throw ApiError.BadRequest(`Шоу с таким id:${showId} не существует`);
    }
    const isWasted = await WastedHistory.findOne(
      {
        username,
        'tvShows.itemId': showId,
      },
      { 'tvShows.$': showId },
    ).exec();
    if (!isWasted) {
      await WastedHistory.updateOne(
        { username },
        {
          $push: {
            tvShows: [
              {
                itemId: showId,
                status,
              },
            ],
          },
        },
        { upsert: true, runValidators: true },
      );
      await showService.setWatchCount(showId);
      return;
    }
    if (status === isWasted?.tvShows[0].status) {
      throw ApiError.BadRequest(`Объект уже имеет статус "${status}"`);
    }
    await WastedHistory.updateOne(
      { username, 'tvShows.itemId': showId },
      { 'tvShows.$.status': status },
      { runValidators: true },
    );
    await showService.setWatchCount(showId);
  }

  async setEpisodeWasted(username, episodeId, showId) {
    const isEpisodeExists = await Episode.exists({
      show_id: showId,
      id: episodeId,
    });
    if (!isEpisodeExists) {
      throw ApiError.BadRequest(
        `Шоу не содержит эпизод с таким id:${episodeId}`,
      );
    }
    const isWasted = await WastedHistory.exists({
      username,
      'tvShows.watchedEpisodes.itemId': episodeId,
    });
    if (!isWasted) {
      const isShowExists = await WastedHistory.exists({
        username,
        'tvShows.itemId': showId,
      });
      if (!isShowExists) {
        await WastedHistory.updateOne(
          {
            username,
          },
          {
            tvShows: {
              itemId: showId,
              status: 'watching',
            },
          },
          { runValidators: true },
        );
      }
      await WastedHistory.updateOne(
        { username, 'tvShows.itemId': showId },
        {
          $push: {
            'tvShows.$.watchedEpisodes': [{ itemId: episodeId }],
          },
        },
        { runValidators: true },
      );
      await episodeService.setWatchCount(episodeId);
      return;
    }
    await WastedHistory.updateOne(
      { username, 'tvShows.itemId': showId },
      { $pull: { 'tvShows.$.watchedEpisodes': { itemId: episodeId } } },
    );
    await episodeService.setWatchCount(episodeId);
  }

  async getWastedIds(username, type) {
    if (!username) {
      return [];
    }
    const wastedIds = (
      await WastedHistory.findOne({ username }, `${type}`).exec()
    )[type]
      ?.filter(
        (item) => item.status === 'watched' || item.status === 'watching',
      )
      .map((item) => item.itemId);

    return wastedIds;
  }
}

export default new WastedHistoryService();
