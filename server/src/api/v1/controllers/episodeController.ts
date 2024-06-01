import type { NextFunction, Response, Request } from 'express';
import type { RatingRes, ReactionRes } from '#types/types';
import { getRatingOptions } from '#config/index.js';
import { episodeService, seasonService, showService } from '#services/index.js';
import { EpisodeFull } from '#utils/dtos/index.js';
import { IEpisodeUpdate } from '#interfaces/IApp';

class ShowController {
  async getEpisode(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<EpisodeFull> | void> {
    try {
      const { id } = req.params;
      const episode = await episodeService.getEpisode(+id);
      const response = new EpisodeFull(episode);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async updateEpisode(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<EpisodeFull> | void> {
    try {
      const id = +req.params.id;
      const options = req.body as IEpisodeUpdate;
      const episode = await episodeService.updateEpisode(id, options);
      const response = new EpisodeFull(episode);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async setEpisodeRating(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<RatingRes> | void> {
    try {
      const id = +req.params.id;
      const username = req.user.username;
      const rating = await getRatingOptions(req.body.rating);
      const userRating = await episodeService.setRating(username, id, rating);
      const episodeRating = await episodeService.setTotalRating(
        userRating.episodeId,
      );
      const seasonRating = await seasonService.setTotalRating(
        userRating.showId,
        userRating.seasonNumber,
      );
      const showRating = await showService.setTotalRating(userRating.showId);
      const totalRating = { showRating, seasonRating, episodeRating };
      const response = { userRating, totalRating } as RatingRes;
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async setEpisodeReaction(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ReactionRes> | void> {
    try {
      const id = +req.params.id;
      const username = req.user.username;
      const reactions = req.body.reactions as string[];
      const userReactions = await episodeService.setEpisodeReactions(
        username,
        id,
        reactions,
      );

      const episodeReactions = await episodeService.setTotalReactions(id);
      await seasonService.setTotalReactions(
        userReactions.showId,
        userReactions.seasonNumber,
      );
      await showService.setTotalReactions(userReactions.showId);
      const response = {
        userReactions,
        reactions: episodeReactions,
      } as ReactionRes;
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new ShowController();
