import { Episode, WastedHistory } from '../database/models/index.js';
import ApiError from '../utils/apiError.js';
import { EpisodeDto } from '../dtos/index.js';

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
    console.log(episode.watch_count);
    episode.save();
  }
}
export default new EpisodeService();
