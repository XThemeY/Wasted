import wastedHistoryService from '../services/wastedHistoryService.js';

class WastedHistoryController {
  async setMovieWasted(req, res, next) {
    try {
      const { movieId, status } = req.body;
      const username = req.user.username;
      if (req.method === 'POST') {
        await wastedHistoryService.setMovieWasted(username, movieId, status);
        return res.sendStatus(200);
      }
      if (req.method === 'DELETE') {
        await wastedHistoryService.delMovieWasted(username, movieId);
        return res.sendStatus(200);
      }
    } catch (e) {
      next(e);
    }
  }

  async setShowWasted(req, res, next) {
    try {
      const { showId, status } = req.body;
      const username = req.user.username;
      if (req.method === 'POST') {
        await wastedHistoryService.setShowWasted(username, showId, status);
        return res.sendStatus(200);
      }
      if (req.method === 'DELETE') {
        await wastedHistoryService.delShowWasted(username, showId);
        return res.sendStatus(200);
      }
    } catch (e) {
      next(e);
    }
  }

  async setEpisodeWasted(req, res, next) {
    try {
      const { episodeId } = req.body;
      const { id } = req.params;
      const username = req.user.username;
      if (req.method === 'POST') {
        await wastedHistoryService.setEpisodeWasted(username, episodeId, +id);
        return res.sendStatus(200);
      }
      if (req.method === 'DELETE') {
        await wastedHistoryService.delEpisodeWasted(username, episodeId, +id);
        return res.sendStatus(200);
      }
    } catch (e) {
      next(e);
    }
  }
}

export default new WastedHistoryController();
