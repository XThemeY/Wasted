import {
  Comment,
  CommentsMovie,
  CommentsShow,
  CommentsSeason,
  CommentsEpisode,
} from '#db/models/index.js';
import ApiError from '#utils/apiError.js';
import { EpisodeDto } from '#dtos/index.js';
import { seasonService } from '#apiV1/services/index.js';

class CommentService {
  async getComments() {
    console.log('Comments have gotten');
  }

  async addComment(body, files, username) {
    if (body.type === 'movie') {
      const comment = await Comment.create({
        username,
        comment_body: body.comment_body,
        parent_comments_id: body.parent_comments_id,
        images_url: files?.map((item) => item.path),
      });
      await CommentsMovie.findOneAndUpdate(
        { media_id: body.media_id },
        { $push: { comments: comment._id } },
        { upsert: true },
      );
      return comment;
    }
    if (body.type === 'tvshow') {
      const comment = await Comment.create({
        username,
        comment_body: body.comment_body,
        parent_comments_id: body.parent_comments_id,
        images_url: files?.map((item) => item.path),
      });
      await CommentsShow.findOneAndUpdate(
        { media_id: body.media_id },
        { $push: { comments: comment._id } },
        { upsert: true },
      );
      return comment;
    }
    if (body.type === 'season') {
      const comment = await Comment.create({
        username,
        comment_body: body.comment_body,
        parent_comments_id: body.parent_comments_id,
        images_url: files?.map((item) => item.path),
      });
      await CommentsSeason.findOneAndUpdate(
        { media_id: body.media_id },
        { $push: { comments: comment._id } },
        { upsert: true },
      );
      return comment;
    }
    if (body.type === 'episode') {
      const comment = await Comment.create({
        username,
        comment_body: body.comment_body,
        parent_comments_id: body.parent_comments_id,
        images_url: files?.map((item) => item.path),
      });
      await CommentsEpisode.findOneAndUpdate(
        { media_id: body.media_id },
        { $push: { comments: comment._id } },
        { upsert: true },
      );
      return comment;
    }
    return ApiError.BadRequest('Не удалось добавить комментарий');
  }

  async editComment() {
    console.log('Comment edited');
  }

  async delComment() {
    console.log('Comment edited');
  }

  async setReactionComment() {
    console.log('Comment reacted');
  }
}
export default new CommentService();
