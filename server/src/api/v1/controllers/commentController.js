import { commentService } from '#apiV1/services/index.js';

class CommentController {
  async getComment(req, res, next) {
    try {
      const { commentId } = req.query;
      const comment = await commentService.getComment(commentId);
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
      const { body, files, query } = req;
      const response = await commentService.editComment(
        query.commentId,
        body.comment_body,
        files,
      );
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async delComment(req, res, next) {
    try {
      const { commentId } = req.body;
      const response = await commentService.delComment(commentId);
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
