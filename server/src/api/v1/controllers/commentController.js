import ApiError from '#utils/apiError.js';
import { getRatingOptions, getMediaReactions } from '#apiV1/config/index.js';
import { commentService } from '#apiV1/services/index.js';

class CommentController {
  async getComments(req, res, next) {
    try {
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async addComment(req, res, next) {
    try {
      const body = req.body;
      const files = req.files;
      const { username } = req.user;
      const fieldsIsValid = req.fieldsIsValid || false;
      const response = await commentService.addComment(
        body,
        files,
        username,
        fieldsIsValid,
      );
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async editComment(req, res, next) {
    try {
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async delComment(req, res, next) {
    try {
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
