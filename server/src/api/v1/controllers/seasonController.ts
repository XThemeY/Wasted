import type { NextFunction, Response, Request } from 'express';
import { seasonService } from '#services/index.js';
import { SeasonFull } from '#utils/dtos/index.js';
import type { ISeasonUpdate } from '#interfaces/IApp';

class ShowController {
  async getSeason(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<SeasonFull> | void> {
    try {
      const id = +req.params.id;
      const season = await seasonService.getSeason(id);
      const response = new SeasonFull(season);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async updateSeason(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<SeasonFull> | void> {
    try {
      const id = +req.params.id;
      const options = req.body as ISeasonUpdate;
      const season = await seasonService.updateSeason(+id, options);
      const response = new SeasonFull(season);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new ShowController();
