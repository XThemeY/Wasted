import type { NextFunction, Response, Request } from 'express';
import ApiError from '#utils/apiError.js';
import { seasonService } from '#services/index.js';
import { SeasonFull } from '#utils/dtos/index.js';

class ShowController {
  async getSeason(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<SeasonFull> | void> {
    try {
      const id = +req.params.id;
      const season = await seasonService.getSeason(id);
      if (!season) {
        return next(
          ApiError.BadRequest(`Сезона с таким id:${id} не существует`),
        );
      }

      const response = new SeasonFull(season);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new ShowController();
