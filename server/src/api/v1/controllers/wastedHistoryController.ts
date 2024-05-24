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

  async setMediaWasted(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { mediaId, status, mediaType } = req.body;
      const { username } = req.user;
      const response = await wastedHistoryService.setMediaWasted(
        username,
        mediaId,
        status,
        mediaType,
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
