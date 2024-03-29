import ApiError from '#utils/apiError.js';
import { getRatingOptions, getMediaReactions } from '#apiV1/config/index.js';
import { episodeService } from '#apiV1/services/index.js';

class ShowController {
  async getEpisode(req, res, next) {
    try {
      const { episodeId } = req.params;

      if (!tvShow) {
        return next(ApiError.BadRequest(`Неправильный адрес`));
      }
      res.json(tvShow);
    } catch (e) {
      next(e);
    }
  }

  async setEpisodeRating(req, res, next) {
    try {
      const { episodeId, id } = req.params;
      const username = req.user.username;
      const rating = getRatingOptions(req.body.rating);
      const response = await episodeService.setRating(
        username,
        +id,
        +episodeId,
        rating,
      );
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async setEpisodeReaction(req, res, next) {
    try {
      const { episodeId, id } = req.params;
      const username = req.user.username;
      const reactions = getMediaReactions(req.body.reactions);
      const response = await episodeService.setEpisodeReactions(
        username,
        +id,
        +episodeId,
        reactions,
      );
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new ShowController();
