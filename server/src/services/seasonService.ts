import { Season } from '#db/models/index.js';
import type { ISeasonModel } from '#interfaces/IModel';
import { IReactions } from '#interfaces/IFields';
class SeasonService {
  async getSeason(id: number): Promise<ISeasonModel> {
    const season = await Season.findOne({ id }).exec();
    return season;
  }

  //   async setWatchCount(id) {

  //   }

  async setTotalRating(showId: number, seasonNumber: number): Promise<number> {
    const season = await Season.findOne(
      {
        show_id: showId,
        season_number: seasonNumber,
      },
      'episodes rating episode_count',
    )
      .populate('episodes', 'rating')
      .exec();
    const seasonArr = season.episodes
      .filter((el) => el.rating !== 0)
      .map((el) => el.rating);
    if (!seasonArr.length) {
      season.rating = 0;
      await season.save();
      return season.rating;
    }
    const seasonRating =
      seasonArr.reduce((sum, value) => sum + value, 0) / seasonArr.length;
    season.rating =
      seasonRating % 1 === 0 ? seasonRating : +seasonRating.toFixed(2);
    await season.save();
    return season.rating;
  }

  async setTotalReactions(
    showId: number,
    seasonNumber: number,
  ): Promise<IReactions> {
    const season = await Season.findOne(
      { show_id: showId, season_number: seasonNumber },
      'reactions',
    )
      .populate('episodes', 'reactions')
      .exec();

    const reactionsKeys = Object.keys(season.reactions);
    reactionsKeys.forEach((key) => {
      season.reactions[key].vote_count = 0;
    });

    season.episodes.forEach((el) => {
      Object.keys(el.reactions).forEach((key) => {
        season.reactions[key].vote_count += el.reactions[key].vote_count;
      });
    });

    const total_votes = reactionsKeys.reduce(
      (acc, key) => acc + season.reactions[key].vote_count,
      0,
    );

    if (!total_votes) {
      reactionsKeys.forEach((key) => {
        season.reactions[key].value = 0;
      });
      await season.save();
      return season.reactions;
    }
    reactionsKeys.forEach((key) => {
      season.reactions[key].value = +(
        (100 * season.reactions[key].vote_count) /
        total_votes
      ).toFixed(0);
    });
    await season.save();
    return season.reactions;
  }
}
export default new SeasonService();
