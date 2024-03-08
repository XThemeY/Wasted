import {
  Episode,
  Movie,
  TVShow,
  WastedHistory,
} from '../database/models/index.js';
import movieService from './movieService.js';
import ApiError from '../utils/apiError.js';
import showService from './showService.js';
import episodeService from './episodeService.js';

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
        'movies.movieId': movieId,
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
                movieId,
                status,
                watchCount: 1,
              },
            ],
          },
        },
        { upsert: true, runValidators: true },
      );
      if (status === 'watched') {
        await movieService.setWatchCount(movieId);
      }
      return;
    }

    if (status === isWasted?.movies[0].status) {
      throw ApiError.BadRequest(`Объект уже имеет статус "${status}"`);
    }
    await WastedHistory.updateOne(
      { username, 'movies.movieId': movieId },
      { 'movies.$.status': status },
      { runValidators: true },
    );
    if (status === 'watched') {
      await movieService.setWatchCount(movieId);
    }
  }

  async delMovieWasted(username, movieId) {
    const isWasted = await WastedHistory.exists({
      username,
      'movies.movieId': movieId,
    });

    if (!isWasted) {
      throw ApiError.BadRequest(`Объекта не существует`);
    }
    await WastedHistory.updateOne(
      { username },
      { $pull: { movies: { movieId } } },
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
        'tvShows.showId': showId,
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
                showId,
                status,
              },
            ],
          },
        },
        { upsert: true, runValidators: true },
      );
      if (status === 'watched' || status === 'watching') {
        await showService.setWatchCount(showId);
      }
      return;
    }
    if (status === isWasted?.tvShows[0].status) {
      throw ApiError.BadRequest(`Объект уже имеет статус "${status}"`);
    }
    await WastedHistory.updateOne(
      { username, 'tvShows.showId': showId },
      { 'tvShows.$.status': status },
      { runValidators: true },
    );
    if (status === 'watched' || status === 'watching') {
      await showService.setWatchCount(showId);
    }
  }

  async delShowWasted(username, showId) {
    const isWasted = await WastedHistory.findOne({
      username,
      'tvShows.showId': showId,
    });
    if (!isWasted) {
      throw ApiError.BadRequest(`Объекта не существует`);
    }
    if (isWasted.tvShows[0].status === 'dropped') {
      throw ApiError.BadRequest(`Объект уже имеет статус "dropped"`);
    }
    await WastedHistory.updateOne(
      { username, 'tvShows.showId': showId },
      { 'tvShows.$.status': 'dropped' },
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
      'tvShows.watchedEpisodes.episodeId': episodeId,
    });
    if (!isWasted) {
      const isShowExists = await WastedHistory.exists({
        username,
        'tvShows.showId': showId,
      });
      if (!isShowExists) {
        await WastedHistory.updateOne(
          {
            username,
          },
          {
            tvShows: {
              showId,
              status: 'watching',
            },
          },
          { runValidators: true },
        );
      }
      await WastedHistory.updateOne(
        { username, 'tvShows.showId': showId },
        {
          $push: {
            'tvShows.$.watchedEpisodes': [{ episodeId }],
          },
        },
        { runValidators: true },
      );
      await episodeService.setWatchCount(episodeId);
      return;
    }
    throw ApiError.BadRequest(`Объект уже имеет статус "watching"`);
  }

  async delEpisodeWasted(username, episodeId, showId) {
    const isWasted = await WastedHistory.exists({
      username,
      'tvShows.watchedEpisodes.episodeId': episodeId,
    });
    if (!isWasted) {
      throw ApiError.BadRequest(`Объекта не существует`);
    }
    await WastedHistory.updateOne(
      { username, 'tvShows.showId': showId },
      { $pull: { 'tvShows.$.watchedEpisodes': { episodeId } } },
    );
    await episodeService.setWatchCount(episodeId);
  }

  async getWastedIds(username, type) {
    if (!username) {
      return [];
    }
    const wastedIds = (
      await WastedHistory.findOne({ username }, `wastedHistory.${type}`).exec()
    )?.wastedHistory[type]
      .filter((item) => item.status === 'watched')
      .map((item) => item.itemId);
    return wastedIds;
  }
}

export default new WastedHistoryService();
