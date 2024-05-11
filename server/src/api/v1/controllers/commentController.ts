import { commentService } from '#services/index.js';
import ApiError from '#utils/apiError.js';

class CommentController {
  async getComment(req, res, next) {
    try {
      const { id } = req.params;
      const comment = await commentService.getComment(id);
      return res.json(comment);
    } catch (e) {
      next(e);
    }
  }

  async getComments(req, res, next) {
    try {
      const { media_id, type } = req.query;
      const comments = await commentService.getComments(media_id, type);
      return res.json(comments);
    } catch (e) {
      next(e);
    }
  }

  async addComment(req, res, next) {
    try {
      const { body, files } = req;
      const { username } = req.user;
      const response = await commentService.addComment(body, files, username);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async editComment(req, res, next) {
    try {
      const { body, files, params } = req;
      const img_urls = body.images_urls?.split(',') || [];
      if (!files?.length && !img_urls?.length && !body.comment_body) {
        return next(ApiError.BadRequest('Комментарий не должен быть пустым'));
      }
      const response = await commentService.editComment(
        params.id,
        body.comment_body || '',
        img_urls.length ? img_urls : [],
        files,
      );
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async delComment(req, res, next) {
    try {
      const { id } = req.params;
      const response = await commentService.delComment(id);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async restoreComment(req, res, next) {
    try {
      const { id } = req.params;
      const response = await commentService.restoreComment(id);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async setReactionComment(req, res, next) {
    try {
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new CommentController();
