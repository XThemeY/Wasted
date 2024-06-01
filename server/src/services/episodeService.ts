import {
  UserRatings,
  Episode,
  WastedHistory,
  UserReactions,
} from '#db/models/index.js';
import ApiError from '#utils/apiError.js';
import type { RatingTuple, UserReaction, UserRating } from '#types/types';
import type { IEpisodeModel } from '#interfaces/IModel';
import type { IReactions } from '#interfaces/IFields';
import type { IEpisodeUpdate } from '#interfaces/IApp';
import mongoose from 'mongoose';

class EpisodeService {
  async getEpisode(id: number): Promise<IEpisodeModel> {
    const episode = await Episode.findOne({ id }).exec();
    if (!episode) throw ApiError.BadRequest(`Эпизод с id:${id} не найден`);
    return episode;
  }

  async updateEpisode(
    id: number,
    options: IEpisodeUpdate,
  ): Promise<IEpisodeModel> {
    const episode = await Episode.findOneAndUpdate(
      { id },
      { ...options },
      { new: true, runValidators: true },
    ).exec();
    if (!episode) throw ApiError.BadRequest(`Эпизод с id:${id} не найден`);
    return episode;
  }

  async setRating(
    username: string,
    itemId: number,
    ratingTuple: RatingTuple,
  ): Promise<UserRating> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const episode = await Episode.findOne(
        {
          id: itemId,
        },
        'show_id ratings.wasted season_number',
      )
        .session(session)
        .exec();
      if (!episode) {
        throw ApiError.BadRequest(`Эпизод c id:${itemId} не найден`);
      }
      const isRated = await UserRatings.findOne(
        {
          username,
          'tvShows.episodes.itemId': itemId,
        },
        { 'tvShows.episodes.$': itemId },
      )
        .session(session)
        .exec();

      //Add rating
      if (!isRated) {
        await UserRatings.updateOne(
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
          { runValidators: true, session },
        ).exec();
        episode.ratings.wasted[ratingTuple[0]] =
          episode.ratings.wasted[ratingTuple[0]] + ratingTuple[1];
        episode.ratings.wasted.vote_count += 1;

        //Delete rating
      } else if (ratingTuple[1] === isRated.tvShows.episodes[0].rating) {
        await UserRatings.updateOne(
          {
            username,
            'tvShows.episodes.itemId': itemId,
          },
          {
            $pull: { 'tvShows.episodes': { itemId } },
          },
          { session },
        );
        episode.ratings.wasted[ratingTuple[0]] =
          episode.ratings.wasted[ratingTuple[0]] - ratingTuple[1];
        episode.ratings.wasted.vote_count -= 1;
      } else {
        //Update rating
        await UserRatings.updateOne(
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
          { runValidators: true, session },
        );
        episode.ratings.wasted[ratingTuple[0]] =
          episode.ratings.wasted[ratingTuple[0]] + ratingTuple[1];
        episode.ratings.wasted[isRated.tvShows.episodes[0].ratingName] =
          episode.ratings.wasted[isRated.tvShows.episodes[0].ratingName] -
          isRated.tvShows.episodes[0].rating;
      }
      await episode.save({ session });
      await session.commitTransaction();
      session.endSession();
      return {
        showId: episode.show_id,
        episodeId: itemId,
        seasonNumber: episode.season_number,
        rating: episode.ratings.wasted,
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return err;
    }
  }

  async setTotalRating(id: number): Promise<number> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const episode = await Episode.findOne(
        { id },
        'rating ratings.wasted season_number',
      )
        .session(session)
        .exec();
      const ratingArr = Object.values(episode.ratings.wasted)
        .slice(0, -1)
        .filter((el) => el !== 0);

      if (!ratingArr.length) {
        episode.rating = 0;
      } else {
        const rating =
          ratingArr.reduce((sum: number, value: number) => sum + value, 0) /
          episode.ratings.wasted.vote_count;
        episode.rating = rating % 1 === 0 ? rating : +rating.toFixed(2);
      }
      await episode.save({ session });
      await session.commitTransaction();
      session.endSession();
      return episode.rating;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return err;
    }
  }

  async setEpisodeReactions(
    username: string,
    itemId: number,
    reactions: string[],
  ): Promise<UserReaction> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const episode = await Episode.findOne(
        {
          id: itemId,
        },
        'reactions season_number',
      )
        .session(session)
        .exec();
      if (!episode) {
        throw ApiError.BadRequest(`Эпизод c id:${itemId} не найден`);
      }
      const isReacted = await UserReactions.findOne(
        {
          username,
          'tvShows.episodes.itemId': itemId,
        },
        { 'tvShows.episodes.$': itemId },
      )
        .session(session)
        .exec();
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
          { runValidators: true, session },
        );
        reactions.forEach((el) => {
          episode.reactions[el].vote_count += 1;
        });
      } else {
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
          { runValidators: true, session },
        );
        reactions.forEach((el) => {
          episode.reactions[el].vote_count += 1;
        });
      }
      await episode.save({ session });
      await session.commitTransaction();
      session.endSession();
      return { showId: itemId, seasonNumber: episode.season_number, reactions };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return err;
    }
  }

  async setTotalReactions(id: number): Promise<IReactions> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const episode = await Episode.findOne({ id }, 'reactions')
        .session(session)
        .exec();
      const reactionsKeys = Object.keys(episode.reactions);
      const total_votes = reactionsKeys.reduce(
        (acc, key) => acc + episode.reactions[key].vote_count,
        0,
      );

      if (!total_votes) {
        reactionsKeys.forEach((key) => {
          episode.reactions[key].value = 0;
        });
      } else {
        reactionsKeys.forEach((key) => {
          episode.reactions[key].value = +(
            (100 * episode.reactions[key].vote_count) /
            total_votes
          ).toFixed(0);
        });
      }
      await episode.save({ session });
      await session.commitTransaction();
      session.endSession();
      return episode.reactions;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return err;
    }
  }

  async setWatchCount(id: number): Promise<number> {
    const watch_count = await WastedHistory.countDocuments({
      'tvShows.watchedEpisodes.itemId': id,
    }).exec();
    await Episode.updateOne({ id }, { $set: { watch_count } }).exec();

    return watch_count;
  }
}
export default new EpisodeService();
