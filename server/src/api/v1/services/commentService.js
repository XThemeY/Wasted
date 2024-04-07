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
  async getComment(commentId, username = {}) {
    const comment = await Comment.findOne({ id: commentId, username });
    return comment;
  }

  async getUserComments(username) {
    const comments = await Comment.find({ username });
    return comments;
  }

  async getComments(media_id, type) {
    let comments = [];
    switch (type) {
      case 'movie':
        comments = await CommentsMovie.findOne({ media_id });
        return comments;
      case 'tvshow':
        comments = await CommentsShow.findOne({ media_id });
        return comments;
      case 'season':
        comments = await CommentsSeason.findOne({ media_id });
        return comments;
      case 'episode':
        comments = await CommentsEpisode.findOne({ media_id });
        return comments;
      default:
        throw ApiError.BadRequest(
          `Ошибка запроса. Поле "type" должно иметь одно из значений: [${commentMediaTypes}]`,
        );
    }
  }

  async addComment(body, files, username) {
    const { type, comment_body, parent_comments_id, media_id } = body;
    const images_url = files?.map((item) => item.destination + item.filename);

    if (parent_comments_id) {
      const isExist = await Comment.exists({
        media_id,
        id: parent_comments_id,
      });
      if (!isExist) {
        throw ApiError.BadRequest('Родительский комментарий не существует');
      }
    }

    if (type === 'movie') {
      const comment = await Comment.create({
        username,
        media_id,
        comment_body: comment_body,
        parent_comments_id: parent_comments_id,
        images_url: images_url,
      });
      await CommentsMovie.findOneAndUpdate(
        { media_id: media_id },
        { $push: { comments: comment._id } },
        { upsert: true },
      );
      return comment;
    }
    if (type === 'tvshow') {
      const comment = await Comment.create({
        username,
        media_id,
        comment_body: comment_body,
        parent_comments_id: parent_comments_id,
        images_url: images_url,
      });
      await CommentsShow.findOneAndUpdate(
        { media_id: media_id },
        { $push: { comments: comment._id } },
        { upsert: true },
      );
      return comment;
    }
    if (type === 'season') {
      const comment = await Comment.create({
        username,
        media_id,
        comment_body: comment_body,
        parent_comments_id: parent_comments_id,
        images_url: images_url,
      });
      await CommentsSeason.findOneAndUpdate(
        { media_id: media_id },
        { $push: { comments: comment._id } },
        { upsert: true },
      );
      return comment;
    }
    if (type === 'episode') {
      const comment = await Comment.create({
        username,
        media_id,
        comment_body: comment_body,
        parent_comments_id: parent_comments_id,
        images_url: images_url,
      });
      await CommentsEpisode.findOneAndUpdate(
        { media_id: media_id },
        { $push: { comments: comment._id } },
        { upsert: true },
      );
      return comment;
    }
    throw ApiError.BadRequest('Не удалось добавить комментарий');
  }

  async editComment(commentId, comment_body, files) {
    const comment = await Comment.findOne({ id: commentId });
    if (!comment || comment.isDeleted) {
      throw ApiError.BadRequest(
        `Комментарий с таким id:${commentId} не существует или удален`,
      );
    }
    const newComment = await Comment.findOneAndUpdate(
      { id: commentId },
      {
        $set: {
          comment_body,
          images_url: files?.map((item) => item.destination + item.filename),
        },
      },
      { new: true },
    );
    return newComment;
  }

  async delComment(commentId) {
    const comment = await Comment.findOne({ id: commentId });

    if (!comment || comment.isDeleted) {
      throw ApiError.BadRequest(
        `Комментарий с таким id:${commentId} уже удален или не существует`,
      );
    }
    const delComment = await Comment.findOneAndUpdate(
      { id: commentId },
      { $set: { isDeleted: true } },
      { new: true },
    );
    return delComment;
  }

  async setReactionComment() {
    console.log('Comment reacted');
  }
}
export default new CommentService();
