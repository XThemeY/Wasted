import { wastedHistoryService } from '#services/index.js';

class WastedHistoryController {
  async setMovieWasted(req, res, next) {
    try {
      const { movieId, status } = req.body;
      const username = req.user.username;
      await wastedHistoryService.setMovieWasted(username, movieId, status);
      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  async setShowWasted(req, res, next) {
    try {
      const { showId, status } = req.body;
      const username = req.user.username;
      await wastedHistoryService.setShowWasted(username, showId, status);
      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  async setEpisodeWasted(req, res, next) {
    try {
      const { episodeId } = req.body;
      const { id } = req.params;
      const username = req.user.username;
      const response = await wastedHistoryService.setEpisodeWasted(
        username,
        episodeId,
        +id,
      );
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new WastedHistoryController();
