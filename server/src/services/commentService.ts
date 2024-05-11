import {
  Comment,
  CommentsMovie,
  CommentsShow,
  CommentsSeason,
  CommentsEpisode,
} from '#db/models/index.js';
import ApiError from '#utils/apiError.js';
import { commentMediaTypes } from '#config/index.js';
import { CommentDto } from '#utils/dtos/index.js';

class CommentService {
  async getComment(commentId, username) {
    let comment = {};
    if (!username) {
      comment = await Comment.findOne({
        id: commentId,
      });
      if (!comment) {
        throw ApiError.BadRequest(
          `Комментарий с таким id:${commentId} не существует`,
        );
      }
      const commentDto = new CommentDto(comment);
      return commentDto;
    }
    comment = await Comment.findOne({
      id: commentId,
      username,
    });
    if (!comment) {
      throw ApiError.BadRequest(
        `Комментарий с таким id:${commentId} у пользователя: ${username} не существует`,
      );
    }
    const commentDto = new CommentDto(comment);
    return commentDto;
  }

  async getUserComments(username) {
    const comments = await Comment.find({ username });
    if (!comments) {
      throw ApiError.BadRequest(
        `Комментарии пользователя с id:${username} не найдены`,
      );
    }
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
      const commentDto = new CommentDto(comment);
      return commentDto;
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
      const commentDto = new CommentDto(comment);
      return commentDto;
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
      const commentDto = new CommentDto(comment);
      return commentDto;
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
      const commentDto = new CommentDto(comment);
      return commentDto;
    }
    throw ApiError.BadRequest('Не удалось добавить комментарий');
  }

  async editComment(commentId, comment_body, img_urls, files) {
    const comment = await Comment.findOne({ id: commentId });
    if (!comment || comment.isDeleted) {
      throw ApiError.BadRequest(
        `Комментарий с таким id:${commentId} не существует или удален`,
      );
    }
    comment.comment_body = comment_body;
    comment.images_url =
      (files?.length
        ? img_urls.concat(files.map((item) => item.destination + item.filename))
        : img_urls) || [];
    await comment.save();
    const commentDto = new CommentDto(comment);
    return commentDto;
  }

  async delComment(commentId) {
    const comment = await Comment.findOne({ id: commentId });
    if (!comment || comment.isDeleted) {
      throw ApiError.BadRequest(
        `Комментарий с таким id:${commentId} уже удален или не существует`,
      );
    }
    comment.isDeleted = true;
    await comment.save();
    const commentDto = new CommentDto(comment);
    return commentDto;
  }

  async restoreComment(commentId) {
    const comment = await Comment.findOne({ id: commentId });
    if (!comment) {
      throw ApiError.BadRequest(
        `Комментарий с таким id:${commentId}не существует`,
      );
    }
    comment.isDeleted = false;
    await comment.save();
    const commentDto = new CommentDto(comment);
    return commentDto;
  }

  async setReactionComment() {
    console.log('Comment reacted');
  }
}
export default new CommentService();
