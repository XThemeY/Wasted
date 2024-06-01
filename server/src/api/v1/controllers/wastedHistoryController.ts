import type { IUserWastedHistory } from '#interfaces/IApp';
import { seasonService, wastedHistoryService } from '#services/index.js';
import type { NextFunction, Request, Response } from 'express';

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

  async setMediaWasted(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const id = +req.params.id;
      const { status, mediaType } = req.body;
      const { username } = req.user;
      const response = await wastedHistoryService.setMediaWasted(
        username,
        id,
        status,
        mediaType,
      );
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async setEpisodeWasted(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUserWastedHistory> | void> {
    try {
      const id = +req.params.id;
      const { username } = req.user;
      const response = await wastedHistoryService.setEpisodeWasted(
        username,
        id,
      );
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async setSeasonWasted(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUserWastedHistory> | void> {
    try {
      const id = +req.params.id;
      const { username } = req.user;
      const season = await seasonService.getSeason(id);

      for (const episode of season.episodes) {
        await wastedHistoryService.setEpisodeWasted(username, episode.id);
      }
      const response = await wastedHistoryService.getUserWastedHistory(
        username,
        season.show_id,
        'show',
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
