import { Episode, Season } from 'Main/src/database/models/index.js';
import ApiError from 'Main/src/utils/apiError.js';
import { EpisodeDto } from 'Main/src/dtos/index.js';
import { showService } from 'Main/src/api/v1/services/index.js';

class SeasonService {
  async getSeason(id) {
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

  //   async setWatchCount(id) {

  //   }

  async setTotalRating(showId, seasonNumber) {
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
      await showService.setTotalRating(showId);
      return;
    }
    const seasonRating =
      seasonArr.reduce((sum, value) => sum + value) / seasonArr.length;
    season.rating =
      seasonRating % 1 === 0 ? seasonRating : seasonRating.toFixed(2);
    await season.save();
    await showService.setTotalRating(showId);
  }

  async setTotalReactions(showId, seasonNumber) {
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
      await showService.setTotalReactions(showId);
      return;
    }
    reactionsKeys.forEach((key) => {
      season.reactions[key].value = (
        (100 * season.reactions[key].vote_count) /
        total_votes
      ).toFixed(0);
    });
    await season.save();
    await showService.setTotalReactions(showId);
  }
}
export default new SeasonService();
