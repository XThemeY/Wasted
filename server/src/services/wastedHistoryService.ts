import type { IUserWastedHistory, IWastedResponse } from '#interfaces/IApp';
import type { WastedItem } from '#types/types';
import { Episode, Movie, TVShow, WastedHistory } from '#db/models/index.js';
import { movieService, showService, episodeService } from '#services/index.js';
import ApiError from '#utils/apiError.js';
import { UserWastedHistory } from '#utils/dtos/index.js';

class WastedHistoryService {
  async setMediaWasted(
    username: string,
    mediaId: number,
    status: string,
    mediaType: 'movie' | 'show' | 'episode',
  ): Promise<IWastedResponse> {
    let isExists, service, mediaKey, showId, isWastedQuery, showQuery;

    const validMovieStatuses = ['watched', 'willWatch', 'notWatched'];
    const validShowStatuses = [
      'watched',
      'willWatch',
      'dropped',
      'notWatched',
      'watching',
    ];
    const validEpisodeStatuses = ['watched', 'notWatched'];

    if (mediaType === 'movie') {
      if (!validMovieStatuses.includes(status)) {
        throw ApiError.BadRequest(`Invalid status for movie: ${status}`);
      }
    } else if (mediaType === 'show') {
      if (!validShowStatuses.includes(status)) {
        throw ApiError.BadRequest(`Invalid status for show: ${status}`);
      }
    } else if (mediaType === 'episode') {
      if (!validEpisodeStatuses.includes(status)) {
        throw ApiError.BadRequest(`Invalid status for episode: ${status}`);
      }
    }

    switch (mediaType) {
      case 'movie':
        isExists = await Movie.exists({ id: mediaId });
        service = movieService;
        mediaKey = 'movies';
        isWastedQuery = { username, 'movies.itemId': mediaId };
        break;
      case 'show':
        isExists = await TVShow.exists({ id: mediaId });
        service = showService;
        mediaKey = 'tvShows';
        isWastedQuery = { username, 'tvShows.itemId': mediaId };
        break;
      case 'episode':
        isExists = await Episode.exists({ id: mediaId });
        if (isExists) {
          const episode = await Episode.findOne({ id: mediaId });
          showId = episode?.show_id;
        }
        service = episodeService;
        mediaKey = 'tvShows';
        isWastedQuery = {
          username,
          'tvShows.watchedEpisodes.itemId': mediaId,
        };
        showQuery = { username, 'tvShows.itemId': showId };
        break;
      default:
        throw ApiError.BadRequest('Invalid media type');
    }

    if (!isExists) {
      throw ApiError.BadRequest(
        `Media type (${mediaType}) with id:${mediaId} does not exist`,
      );
    }

    const isWasted = await WastedHistory.findOne(isWastedQuery, {
      [`${mediaKey}.$`]: mediaId,
    }).exec();

    if (!isWasted) {
      if (mediaType === 'episode') {
        const isShowExists = await WastedHistory.exists(showQuery);
        if (!isShowExists) {
          await WastedHistory.updateOne(
            { username },
            {
              tvShows: {
                itemId: showId,
                status: 'watching',
              },
            },
            { upsert: true, runValidators: true },
          );
        }
        status = 'watched';
        await WastedHistory.updateOne(
          showQuery,
          {
            $push: {
              'tvShows.$.watchedEpisodes': [{ itemId: mediaId }],
            },
          },
          { runValidators: true },
        );
      } else {
        console.log('index2');
        await WastedHistory.updateOne(
          { username },
          {
            $push: {
              [mediaKey]: [{ itemId: mediaId, status }],
            },
          },
          { upsert: true, runValidators: true },
        );
      }
    } else if (mediaType === 'episode') {
      status = 'notWatched';
      await WastedHistory.updateOne(showQuery, {
        $pull: { 'tvShows.$.watchedEpisodes': { itemId: mediaId } },
      });
    } else if (status === isWasted[mediaKey][0].status) {
      throw ApiError.BadRequest(`Object already has status "${status}"`);
    } else {
      await WastedHistory.updateOne(
        { username, [`${mediaKey}.itemId`]: mediaId },
        { [`${mediaKey}.$.status`]: status },
        { runValidators: true },
      );
    }

    const watch_count = await service.setWatchCount(mediaId);
    console.log('watch_count', watch_count);

    return { username, mediaId, status, watch_count };
  }

  async setEpisodeWasted(
    username: string,
    episodeId: number,
  ): Promise<IWastedResponse> {
    const episode = await Episode.findOne({ id: episodeId });
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
          { username },
          {
            $push: {
              tvShows: [
                {
                  itemId: episode.show_id,
                  status: 'watching',
                },
              ],
            },
          },
          { upsert: true, runValidators: true },
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
    if (!username) return [];
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

  // async setMovieWasted(
  //   username: string,
  //   movieId: number,
  //   status: string,
  // ): Promise<IWastedResponse> {
  //   const isMovieExists = await Movie.exists({
  //     id: movieId,
  //   });
  //   if (!isMovieExists) {
  //     throw ApiError.BadRequest(`Фильма с таким id:${movieId} не существует`);
  //   }
  //   const isWasted = await WastedHistory.findOne(
  //     {
  //       username,
  //       'movies.itemId': movieId,
  //     },
  //     { 'movies.$': movieId },
  //   ).exec();
  //   if (!isWasted) {
  //     await WastedHistory.updateOne(
  //       { username },
  //       {
  //         $push: {
  //           movies: [
  //             {
  //               itemId: movieId,
  //               status,
  //             },
  //           ],
  //         },
  //       },
  //       { upsert: true, runValidators: true },
  //     );
  //     const watch_count = await movieService.setWatchCount(movieId);
  //     return { username, mediaId: movieId, status, watch_count };
  //   }
  //   if (status === isWasted?.movies[0].status) {
  //     throw ApiError.BadRequest(`Объект уже имеет статус "${status}"`);
  //   }
  //   await WastedHistory.updateOne(
  //     { username, 'movies.itemId': movieId },
  //     { 'movies.$.status': status },
  //     { runValidators: true },
  //   );
  //   const watch_count = await movieService.setWatchCount(movieId);
  //   return { username, mediaId: movieId, status, watch_count };
  // }
  // async setShowWasted(
  //   username: string,
  //   showId: number,
  //   status: string,
  // ): Promise<IWastedResponse> {
  //   const isShowExists = await TVShow.exists({
  //     id: showId,
  //   });
  //   if (!isShowExists) {
  //     throw ApiError.BadRequest(`Шоу с таким id:${showId} не существует`);
  //   }
  //   const isWasted = await WastedHistory.findOne(
  //     {
  //       username,
  //       'tvShows.itemId': showId,
  //     },
  //     { 'tvShows.$': showId },
  //   ).exec();
  //   if (!isWasted) {
  //     await WastedHistory.updateOne(
  //       { username },
  //       {
  //         $push: {
  //           tvShows: [
  //             {
  //               itemId: showId,
  //               status,
  //             },
  //           ],
  //         },
  //       },
  //       { upsert: true, runValidators: true },
  //     );
  //     const watch_count = await showService.setWatchCount(showId);
  //     return { username, mediaId: showId, status, watch_count };
  //   }
  //   if (status === isWasted?.tvShows[0].status) {
  //     throw ApiError.BadRequest(`Объект уже имеет статус "${status}"`);
  //   }
  //   await WastedHistory.updateOne(
  //     { username, 'tvShows.itemId': showId },
  //     { 'tvShows.$.status': status },
  //     { runValidators: true },
  //   );
  //   const watch_count = await showService.setWatchCount(showId);
  //   return { username, mediaId: showId, status, watch_count };
  // }
  // async setEpisodeWasted(
  //   username: string,
  //   episodeId: number,
  // ): Promise<IWastedResponse> {
  //   const episode = await Episode.findOne({
  //     id: episodeId,
  //   });
  //   if (!episode) {
  //     throw ApiError.BadRequest(
  //       `Эпизода с таким id:${episodeId} не существует`,
  //     );
  //   }
  //   const isWasted = await WastedHistory.exists({
  //     username,
  //     'tvShows.watchedEpisodes.itemId': episodeId,
  //   });
  //   if (!isWasted) {
  //     const isShowExists = await WastedHistory.exists({
  //       username,
  //       'tvShows.itemId': episode.show_id,
  //     });
  //     if (!isShowExists) {
  //       await WastedHistory.updateOne(
  //         {
  //           username,
  //         },
  //         {
  //           tvShows: {
  //             itemId: episode.show_id,
  //             status: 'watching',
  //           },
  //         },
  //         { runValidators: true },
  //       );
  //     }
  //     await WastedHistory.updateOne(
  //       { username, 'tvShows.itemId': episode.show_id },
  //       {
  //         $push: {
  //           'tvShows.$.watchedEpisodes': [{ itemId: episodeId }],
  //         },
  //       },
  //       { runValidators: true },
  //     );
  //     const watch_count = await episodeService.setWatchCount(episodeId);
  //     return {
  //       username,
  //       mediaId: episode.show_id,
  //       status: 'watching',
  //       watch_count,
  //     };
  //   }
  //   await WastedHistory.updateOne(
  //     { username, 'tvShows.itemId': episode.show_id },
  //     { $pull: { 'tvShows.$.watchedEpisodes': { itemId: episodeId } } },
  //   );
  //   const watch_count = await episodeService.setWatchCount(episodeId);
  //   return {
  //     username,
  //     mediaId: episode.show_id,
  //     status: 'notWatched',
  //     watch_count,
  //   };
  // }
  // async getWastedIds(username: string, type: string): Promise<number[]> {
  //   if (!username) {
  //     return [];
  //   }
  //   const wastedIds = (
  //     await WastedHistory.findOne({ username }, `${type}`).exec()
  //   )[type]
  //     ?.filter(
  //       (item: WastedItem) =>
  //         item.status === 'watched' || item.status === 'watching',
  //     )
  //     .map((item: WastedItem) => item.itemId);
  //   return wastedIds;
  // }
  // async getUserWastedHistory(username: string): Promise<IUserWastedHistory> {
  //   const userHistory = await WastedHistory.findOne({ username }).exec();
  //   return new UserWastedHistory(userHistory);
  // }
}

export default new WastedHistoryService();
