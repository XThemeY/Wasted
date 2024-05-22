import { wastedHistoryService } from '#services/index.js';
import { NextFunction, Request, Response } from 'express';

class WastedHistoryController {
  async getUserWastedHistory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { username } = req.user;
      await wastedHistoryService.getUserWastedHistory(username);
      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  async setMovieWasted(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { movieId, status } = req.body;
      const { username } = req.user;
      await wastedHistoryService.setMovieWasted(username, movieId, status);
      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  async setShowWasted(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { showId, status } = req.body;
      const { username } = req.user;
      await wastedHistoryService.setShowWasted(username, showId, status);
      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  async setEpisodeWasted(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { episodeId } = req.body;
      const { username } = req.user;
      const response = await wastedHistoryService.setEpisodeWasted(
        username,
        episodeId,
      );
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async getWastedHistory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { username } = req.user;
      const response =
        await wastedHistoryService.getUserWastedHistory(username);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new WastedHistoryController();
