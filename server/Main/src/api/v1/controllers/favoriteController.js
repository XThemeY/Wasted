import { favoriteService } from 'Main/src/api/v1/services/index.js';

class FavoritesController {
  async setMovieFav(req, res, next) {
    try {
      const { movieId } = req.body;
      const username = req.user.username;
      const response = await favoriteService.setMovieFav(username, movieId);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async setShowFav(req, res, next) {
    try {
      const { showId } = req.body;
      const username = req.user.username;
      const response = await favoriteService.setShowFav(username, showId);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async setEpisodeFav(req, res, next) {
    try {
      const { episodeId } = req.body;
      const username = req.user.username;
      const response = await favoriteService.setEpisodeFav(username, episodeId);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new FavoritesController();
