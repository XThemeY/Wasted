import favoriteService from '../services/favoriteService.js';

class FavoritesController {
  async setMovieFav(req, res, next) {
    try {
      const { movieId } = req.body;
      const username = req.user.username;
      if (req.method === 'POST') {
        await favoriteService.setMovieFav(username, movieId);
        return res.sendStatus(200);
      }
      if (req.method === 'DELETE') {
        await favoriteService.delMovieFav(username, movieId);
        return res.sendStatus(200);
      }
    } catch (e) {
      next(e);
    }
  }

  async setShowFav(req, res, next) {
    try {
      const { showId } = req.body;
      const username = req.user.username;
      if (req.method === 'POST') {
        await favoriteService.setShowFav(username, showId);
        return res.sendStatus(200);
      }
      if (req.method === 'DELETE') {
        await favoriteService.delShowFav(username, showId);
        return res.sendStatus(200);
      }
    } catch (e) {
      next(e);
    }
  }

  async setEpisodeFav(req, res, next) {
    try {
      const { episodeId } = req.body;
      const username = req.user.username;
      if (req.method === 'POST') {
        await favoriteService.setEpisodeFav(username, episodeId);
        return res.sendStatus(200);
      }
      if (req.method === 'DELETE') {
        await favoriteService.delEpisodeFav(username, episodeId);
        return res.sendStatus(200);
      }
    } catch (e) {
      next(e);
    }
  }
}

export default new FavoritesController();
