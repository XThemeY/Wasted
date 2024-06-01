import { favoriteService } from '#services/index.js';
import type { Request, Response, NextFunction } from 'express';

class FavoritesController {
  async setMovieFav(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const id = +req.params.id;
      const username = req.user.username;
      const response = await favoriteService.setMovieFav(username, id);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async setShowFav(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const id = +req.params.id;
      const username = req.user.username;
      const response = await favoriteService.setShowFav(username, id);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async setEpisodeFav(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const id = +req.params.id;
      const username = req.user.username;
      const response = await favoriteService.setEpisodeFav(username, id);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async getFavorites(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const username = req.user.username;
      const response = await favoriteService.getFavorites(username);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new FavoritesController();
