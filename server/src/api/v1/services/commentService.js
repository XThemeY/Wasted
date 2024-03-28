import mongoose from 'mongoose';
import {
  Comment,
  CommentsMovie,
  CommentsShow,
  CommentsSeason,
  CommentsEpisode,
} from '#db/models/index.js';
import ApiError from '#utils/apiError.js';
import { commentMediaTypes } from '#apiV1/config/index.js';

class CommentService {
  async getComments() {
    console.log('Comments have gotten');
  }

  async addComment(body, files, username, fieldsIsValid) {
    const type = body.type;
    if (!fieldsIsValid) {
      const counter = await mongoose.connection
        .collection('counters')
        .findOne({ _id: `${type}id` });

      if (!body.comment_body.trim()) {
        throw ApiError.BadRequest('Комментарий не должен быть пустым');
      }
      if (!commentMediaTypes.includes(type)) {
        throw ApiError.BadRequest(
          `Поле "type" должно иметь одно из значений: ${commentMediaTypes}`,
        );
      }
      if (body.media_id > counter.seq) {
        throw ApiError.BadRequest(
          `Объекта из "${type}" с таким id не существует.`,
        );
      }
    }

    if (type === 'movie') {
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
    if (type === 'tvshow') {
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
    if (type === 'season') {
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
    if (type === 'episode') {
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
    throw ApiError.BadRequest('Не удалось добавить комментарий');
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
