import type { NextFunction, Response, Request } from 'express';
import ApiError from '#utils/apiError.js';
import { seasonService } from '#services/index.js';
import { EpisodeShort, SeasonFull } from '#utils/dtos/index.js';
import { ICommentsMediaModel } from '#interfaces/IModel';

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
      const episodes = season.episodes.map((episode) => {
        const commentsCount = (episode.comments as ICommentsMediaModel).comments
          .length;
        const episodeShort = new EpisodeShort(episode, commentsCount);
        return episodeShort;
      });
      const response = new SeasonFull(season, episodes);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new ShowController();
