import type { IUserWastedHistory, IWastedResponse } from '#interfaces/IApp';
import type { WastedItem } from '#types/types';
import { Episode, Movie, TVShow, WastedHistory } from '#db/models/index.js';
import { movieService, showService, episodeService } from '#services/index.js';
import ApiError from '#utils/apiError.js';
import { UserWastedHistory } from '#utils/dtos/index.js';

class WastedHistoryService {
  async setMovieWasted(
    username: string,
    movieId: number,
    status: string,
  ): Promise<IWastedResponse> {
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
              },
            ],
          },
        },
        { upsert: true, runValidators: true },
      );
      const watch_count = await movieService.setWatchCount(movieId);
      return { username, mediaId: movieId, status, watch_count };
    }
    if (status === isWasted?.movies[0].status) {
      throw ApiError.BadRequest(`Объект уже имеет статус "${status}"`);
    }
    await WastedHistory.updateOne(
      { username, 'movies.itemId': movieId },
      { 'movies.$.status': status },
      { runValidators: true },
    );
    const watch_count = await movieService.setWatchCount(movieId);
    return { username, mediaId: movieId, status, watch_count };
  }

  async setShowWasted(
    username: string,
    showId: number,
    status: string,
  ): Promise<IWastedResponse> {
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
      const watch_count = await showService.setWatchCount(showId);
      return { username, mediaId: showId, status, watch_count };
    }
    if (status === isWasted?.tvShows[0].status) {
      throw ApiError.BadRequest(`Объект уже имеет статус "${status}"`);
    }
    await WastedHistory.updateOne(
      { username, 'tvShows.itemId': showId },
      { 'tvShows.$.status': status },
      { runValidators: true },
    );
    const watch_count = await showService.setWatchCount(showId);
    return { username, mediaId: showId, status, watch_count };
  }

  async setEpisodeWasted(
    username: string,
    episodeId: number,
  ): Promise<IWastedResponse> {
    const episode = await Episode.findOne({
      id: episodeId,
    });
    if (!episode) {
      throw ApiError.BadRequest(
        `Эпизода с таким id:${episodeId} не существует`,
      );
    }
    const isWasted = await WastedHistory.exists({
      username,
      'tvShows.watchedEpisodes.itemId': episodeId,
    });
    if (!isWasted) {
      const isShowExists = await WastedHistory.exists({
        username,
        'tvShows.itemId': episode.show_id,
      });
      if (!isShowExists) {
        await WastedHistory.updateOne(
          {
            username,
          },
          {
            tvShows: {
              itemId: episode.show_id,
              status: 'watching',
            },
          },
          { runValidators: true },
        );
      }
      await WastedHistory.updateOne(
        { username, 'tvShows.itemId': episode.show_id },
        {
          $push: {
            'tvShows.$.watchedEpisodes': [{ itemId: episodeId }],
          },
        },
        { runValidators: true },
      );
      const watch_count = await episodeService.setWatchCount(episodeId);
      return {
        username,
        mediaId: episode.show_id,
        status: 'watching',
        watch_count,
      };
    }
    await WastedHistory.updateOne(
      { username, 'tvShows.itemId': episode.show_id },
      { $pull: { 'tvShows.$.watchedEpisodes': { itemId: episodeId } } },
    );
    const watch_count = await episodeService.setWatchCount(episodeId);
    return {
      username,
      mediaId: episode.show_id,
      status: 'notWatched',
      watch_count,
    };
  }

  async getWastedIds(username: string, type: string): Promise<number[]> {
    if (!username) {
      return [];
    }
    const wastedIds = (
      await WastedHistory.findOne({ username }, `${type}`).exec()
    )[type]
      ?.filter(
        (item: WastedItem) =>
          item.status === 'watched' || item.status === 'watching',
      )
      .map((item: WastedItem) => item.itemId);
    return wastedIds;
  }

  async getUserWastedHistory(username: string): Promise<IUserWastedHistory> {
    const userHistory = await WastedHistory.findOne({ username }).exec();

    return new UserWastedHistory(userHistory);
  }
}

export default new WastedHistoryService();
