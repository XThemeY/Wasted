import {
  UserRating,
  Episode,
  WastedHistory,
  UserReactions,
} from '#db/models/index.js';
import ApiError from '#utils/apiError.js';
import { EpisodeDto } from '#utils/dtos/index.js';
import { seasonService } from '#services/index.js';
import type { RatingMsgResponse } from '#types/types';

class EpisodeService {
  async getEpisode(id) {
    const episode = await Episode.findOne({ id })
      .populate({
        path: 'CommentTV EpisodeRating',
      })
      .exec();

    if (!episode) {
      throw ApiError.BadRequest(`Эпизод с таким id:${id} не существует`);
    }
    const episodeDto = new EpisodeDto(episode);
    return episodeDto;
  }

  async setWatchCount(id) {
    const episode = await Episode.findOne(
      {
        id,
      },
      'watch_count',
    ).exec();
    if (!episode) {
      throw ApiError.BadRequest(`Эпизода с таким id:${id} не существует`);
    }
    episode.watch_count = await WastedHistory.find({
      'tvShows.watchedEpisodes.episodeId': id,
    })
      .count()
      .exec();
    await episode.save();
  }

  async setRating(username, showId, itemId, ratingTuple) {
    const responseMSg: RatingMsgResponse = {
      type: 'episode',
      id: itemId,
      status: '',
      message: '',
    };
    const episode = await Episode.findOne(
      {
        show_id: showId,
        id: itemId,
      },
      'ratings.wasted season_number',
    );
    if (!episode) {
      throw ApiError.BadRequest(`Шоу не содержит эпизод с таким id:${itemId}`);
    }
    const seasonNumber = episode.season_number;
    const isRated = await UserRating.findOne(
      {
        username,
        'tvShows.episodes.itemId': itemId,
      },
      { 'tvShows.episodes.$': itemId },
    );
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
      await this.setTotalRating(itemId, showId, seasonNumber);
      responseMSg.status = 'added';
      responseMSg.message = `Поставлен рейтинг ${ratingTuple[1]}`;
      return responseMSg;
    }
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
      await this.setTotalRating(itemId, showId, seasonNumber);
      responseMSg.status = 'del';
      responseMSg.message = `Рейтинг ${ratingTuple[1]} удален`;
      return responseMSg;
    }
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
    await this.setTotalRating(itemId, showId, seasonNumber);
    responseMSg.status = 'updated';
    responseMSg.message = `Рейтинг изменен с ${isRated.movies[0].rating} на ${ratingTuple[1]}`;
    return responseMSg;
  }

  async setTotalRating(id, showId, seasonNumber) {
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
      await seasonService.setTotalRating(showId, seasonNumber);
      return;
    }
    const rating =
      ratingArr.reduce((sum, value) => sum + value) /
      episode.ratings.wasted.vote_count;
    episode.rating = rating % 1 === 0 ? rating : rating.toFixed(2);
    await episode.save();
    await seasonService.setTotalRating(showId, seasonNumber);
  }

  async setEpisodeReactions(username, showId, itemId, reactions) {
    const episode = await Episode.findOne(
      {
        id: itemId,
        show_id: showId,
      },
      'reactions season_number',
    ).exec();
    if (!episode) {
      throw ApiError.BadRequest(`Шоу не содержит эпизод с таким id:${itemId}`);
    }
    const seasonNumber = episode.season_number;

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
      await this.setTotalReactions(itemId, showId, seasonNumber);
      return {
        status: 'added',
        message: `Эпизоду с id:${itemId} поставлены реакции: ${reactions}`,
      };
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
    await this.setTotalReactions(itemId, showId, seasonNumber);
    return {
      status: 'changed',
      message: `Эпизоду с id:${itemId} изменены реакции на ${reactions}`,
    };
  }

  async setTotalReactions(id, showId, seasonNumber) {
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
      await seasonService.setTotalReactions(showId, seasonNumber);
      return;
    }
    reactionsKeys.forEach((key) => {
      episode.reactions[key].value = (
        (100 * episode.reactions[key].vote_count) /
        total_votes
      ).toFixed(0);
    });
    await episode.save();
    await seasonService.setTotalReactions(showId, seasonNumber);
  }
}
export default new EpisodeService();
