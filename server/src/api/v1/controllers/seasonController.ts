import type { NextFunction, Response, Request } from 'express';
import ApiError from '#utils/apiError.js';
import { seasonService } from '#services/index.js';
import { Season } from '#utils/dtos/seasonDto';

class ShowController {
  async getSeason(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<Season> | void> {
    try {
      const id = +req.params.id;
      const season = await seasonService.getSeason(id);
      if (!season) {
        return next(
          ApiError.BadRequest(`Сезона с таким id:${id} не существует`),
        );
      }
      const response = new Season(season);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new ShowController();
