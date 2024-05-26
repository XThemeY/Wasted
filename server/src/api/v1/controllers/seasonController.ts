import type { NextFunction, Response, Request } from 'express';
import { seasonService, wastedHistoryService } from '#services/index.js';
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
      const { id } = req.params;
      const options = req.body as ISeasonUpdate;
      const season = await seasonService.updateSeason(+id, options);
      const response = new SeasonFull(season);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async markSeason(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<SeasonFull> | void> {
    try {
      const { id } = req.params;
      const { username } = req.user;
      const season = await seasonService.getSeason(+id);
      console.log(username);

      for (const episode of season.episodes) {
        console.log(episode.id);
        await wastedHistoryService.setEpisodeWasted(username, episode.id);
      }
      const response = await wastedHistoryService.getUserWastedHistory(
        username,
        season.show_id,
        'show',
        season.season_number,
      );
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new ShowController();
