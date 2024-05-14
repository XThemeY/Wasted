import {
  UserRating,
  Episode,
  WastedHistory,
  UserReactions,
} from '#db/models/index.js';
import ApiError from '#utils/apiError.js';
import type { RatingTuple, UserReaction, _UserRating } from '#types/types';
import type { IEpisodeModel } from '#interfaces/IModel';
import type { IReactions } from '#interfaces/IFields';

class EpisodeService {
  async getEpisode(id: number): Promise<IEpisodeModel> {
    const episode = await Episode.findOne({ id }).exec();
    return episode;
  }

  async setRating(
    username: string,
    itemId: number,
    ratingTuple: RatingTuple,
  ): Promise<_UserRating> {
    const episode = await Episode.findOne(
      {
        id: itemId,
      },
      'show_id ratings.wasted season_number',
    );
    if (!episode) {
      throw ApiError.BadRequest(`Эпизод c id:${itemId} не найден`);
    }
    const isRated = await UserRating.findOne(
      {
        username,
        'tvShows.episodes.itemId': itemId,
      },
      { 'tvShows.episodes.$': itemId },
    );

    //Add rating
    if (!isRated) {
      await UserRating.updateOne(
        {
          username,
        },
        {
          $push: {
            'tvShows.episodes': [
              { itemId, rating: ratingTuple[1], ratingName: ratingTuple[0] },
            ],
          },
        },
        { upsert: true, runValidators: true },
      );
      episode.ratings.wasted[ratingTuple[0]] =
        episode.ratings.wasted[ratingTuple[0]] + ratingTuple[1];
      episode.ratings.wasted.vote_count += 1;
      await episode.save();
      return {
        showId: episode.show_id,
        episodeId: itemId,
        seasonNumber: episode.season_number,
        rating: episode.ratings.wasted,
      };
    }

    //Delete rating
    if (ratingTuple[1] === isRated.tvShows.episodes[0].rating) {
      await UserRating.updateOne(
        {
          username,
          'tvShows.episodes.itemId': itemId,
        },
        {
          $pull: { 'tvShows.episodes': { itemId } },
        },
      );
      episode.ratings.wasted[ratingTuple[0]] =
        episode.ratings.wasted[ratingTuple[0]] - ratingTuple[1];
      episode.ratings.wasted.vote_count -= 1;
      await episode.save();
      return {
        showId: episode.show_id,
        episodeId: itemId,
        seasonNumber: episode.season_number,
        rating: episode.ratings.wasted,
      };
    }

    //Update rating
    await UserRating.updateOne(
      {
        username,
        'tvShows.episodes.itemId': itemId,
      },
      {
        $set: {
          'tvShows.episodes.$': {
            itemId,
            rating: ratingTuple[1],
            ratingName: ratingTuple[0],
          },
        },
      },
      { runValidators: true },
    );
    episode.ratings.wasted[ratingTuple[0]] =
      episode.ratings.wasted[ratingTuple[0]] + ratingTuple[1];
    episode.ratings.wasted[isRated.tvShows.episodes[0].ratingName] =
      episode.ratings.wasted[isRated.tvShows.episodes[0].ratingName] -
      isRated.tvShows.episodes[0].rating;
    await episode.save();
    return {
      showId: episode.show_id,
      episodeId: itemId,
      seasonNumber: episode.season_number,
      rating: episode.ratings.wasted,
    };
  }

  async setTotalRating(id: number): Promise<number> {
    const episode = await Episode.findOne(
      { id },
      'rating ratings.wasted season_number',
    ).exec();
    const ratingArr = Object.values(episode.ratings.wasted)
      .slice(0, -1)
      .filter((el) => el !== 0);

    if (!ratingArr.length) {
      episode.rating = 0;
      await episode.save();
      return episode.rating;
    }
    const rating =
      ratingArr.reduce((sum: number, value: number) => sum + value, 0) /
      episode.ratings.wasted.vote_count;
    episode.rating = rating % 1 === 0 ? rating : +rating.toFixed(2);
    await episode.save();
    return episode.rating;
  }

  async setEpisodeReactions(
    username: string,
    itemId: number,
    reactions: string[],
  ): Promise<UserReaction> {
    const episode = await Episode.findOne(
      {
        id: itemId,
      },
      'reactions season_number',
    ).exec();
    if (!episode) {
      throw ApiError.BadRequest(`Эпизод c id:${itemId} не найден`);
    }
    const isReacted = await UserReactions.findOne(
      {
        username,
        'tvShows.episodes.itemId': itemId,
      },
      { 'tvShows.episodes.$': itemId },
    );
    if (!isReacted) {
      await UserReactions.updateOne(
        {
          username,
        },
        {
          $push: {
            'tvShows.episodes': [{ itemId, reactions }],
          },
        },
        { upsert: true, runValidators: true },
      );
      reactions.forEach((el) => {
        episode.reactions[el].vote_count += 1;
      });
      await episode.save();
      return { showId: itemId, seasonNumber: episode.season_number, reactions };
    }

    isReacted.tvShows.episodes[0].reactions.forEach((el) => {
      episode.reactions[el].vote_count -= 1;
    });
    await UserReactions.updateOne(
      {
        username,
        'tvShows.episodes.itemId': itemId,
      },
      {
        $set: {
          'tvShows.episodes.$': {
            itemId,
            reactions,
          },
        },
      },
      { runValidators: true },
    );
    reactions.forEach((el) => {
      episode.reactions[el].vote_count += 1;
    });
    await episode.save();
    return { showId: itemId, seasonNumber: episode.season_number, reactions };
  }

  async setTotalReactions(id: number): Promise<IReactions> {
    const episode = await Episode.findOne({ id }, 'reactions').exec();
    const reactionsKeys = Object.keys(episode.reactions);
    const total_votes = reactionsKeys.reduce(
      (acc, key) => acc + episode.reactions[key].vote_count,
      0,
    );

    if (!total_votes) {
      reactionsKeys.forEach((key) => {
        episode.reactions[key].value = 0;
      });
      await episode.save();
      return episode.reactions;
    }
    reactionsKeys.forEach((key) => {
      episode.reactions[key].value = +(
        (100 * episode.reactions[key].vote_count) /
        total_votes
      ).toFixed(0);
    });
    await episode.save();
    return episode.reactions;
  }

  async setWatchCount(id: number): Promise<number> {
    const episode = await Episode.findOne(
      {
        id,
      },
      'watch_count',
    ).exec();
    if (!episode) {
      throw ApiError.BadRequest(`Эпизода с таким id:${id} не существует`);
    }
    episode.watch_count = await WastedHistory.countDocuments({
      'tvShows.watchedEpisodes.episodeId': id,
    }).exec();
    await episode.save();
    return episode.watch_count;
  }
}
export default new EpisodeService();
