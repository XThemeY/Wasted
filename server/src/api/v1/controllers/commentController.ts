import type { IAddCommentBody } from '#interfaces/IApp';
import { commentService } from '#services/index.js';
import ApiError from '#utils/apiError.js';
import type { Request, Response, NextFunction } from 'express';

class CommentController {
  async getMediaComments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const media_id = +req.query.media_id;
      const type = req.query.type as string;
      const comments = await commentService.getMediaComments(media_id, type);
      return res.json(comments);
    } catch (e) {
      next(e);
    }
  }

  async getUserComments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { username } = req.user;
      const comments = await commentService.getUserComments(username);
      return res.json(comments);
    } catch (e) {
      next(e);
    }
  }

  async addComment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const body = req.body as IAddCommentBody;
      const { username } = req.user;
      const response = await commentService.addComment(body, username);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async editComment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { comment_id, comment_body, images_url } = req.body;

      if (!comment_body && !images_url?.length) {
        return next(ApiError.BadRequest('Комментарий не должен быть пустым'));
      }
      const response = await commentService.editComment(
        comment_id,
        comment_body,
        images_url,
      );
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async delComment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const id = +req.params.id;
      const response = await commentService.delComment(id);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async restoreComment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const id = +req.params.id;
      const response = await commentService.restoreComment(id);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async setReactionComment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      return res.json();
    } catch (e) {
      next(e);
    }
  }
}

export default new CommentController();
