import {
  Comment,
  CommentsMovie,
  CommentsShow,
  CommentsSeason,
  CommentsEpisode,
} from '#db/models/index.js';
import ApiError from '#utils/apiError.js';
import { CommentDto } from '#utils/dtos/index.js';
import type { ICommentModel, ICommentsMediaModel } from '#interfaces/IModel';
import type { FilterQuery } from 'mongoose';
import type { IAddCommentBody } from '#interfaces/IApp';

class CommentService {
  commentModels = {
    movie: CommentsMovie,
    tvshow: CommentsShow,
    season: CommentsSeason,
    episode: CommentsEpisode,
  };

  commentMediaTypes = Object.keys(this.commentModels);

  async getComment(
    commentId: number,
    username?: string,
  ): Promise<ICommentModel> {
    const query: FilterQuery<ICommentModel> = { id: commentId };
    if (username) {
      query.username = username;
    }
    const comment: ICommentModel | null = await Comment.findOne(query);
    if (!comment) {
      const errorMessage = username
        ? `Комментария с таким id:${commentId} у пользователя: ${username} не существует`
        : `Комментария с таким id:${commentId} не существует`;
      throw ApiError.BadRequest(errorMessage);
    }
    return comment;
  }

  async getUserComments(username: string): Promise<ICommentModel[]> {
    const comments = await Comment.find({ username });
    if (!comments.length) {
      throw ApiError.BadRequest(
        `Комментарии пользователя:${username} не найдены`,
      );
    }
    return comments;
  }

  async getMediaComments(
    media_id: number,
    type: string,
  ): Promise<ICommentsMediaModel> {
    const model = this.commentModels[type];
    if (!model) {
      throw ApiError.BadRequest(
        `Ошибка запроса. Поле "type" должно иметь одно из значений: [${this.commentMediaTypes.join(', ')}]`,
      );
    }
    const comments = await model.findOne({ media_id }).populate('comments');
    if (!comments) {
      throw ApiError.NotFound(
        `Комментарии для media_id: ${media_id} не найдены`,
      );
    }
    return comments;
  }

  async addComment(
    body: IAddCommentBody,
    username: string,
  ): Promise<ICommentModel> {
    const { type, comment_body, parent_comments_id, media_id, images_url } =
      body;

    if (parent_comments_id) {
      const parentCommentExists = await Comment.exists({
        media_id,
        id: parent_comments_id,
      });
      if (!parentCommentExists) {
        throw ApiError.BadRequest('Родительский комментарий не существует');
      }
    }
    const model = this.commentModels[type];
    if (!model) {
      throw ApiError.BadRequest(
        `Ошибка запроса. Поле "type" должно иметь одно из значений: [${this.commentMediaTypes.join(', ')}]`,
      );
    }

    const mediaExists = await model.exists({ media_id });
    if (!mediaExists) {
      throw ApiError.BadRequest(`Media с id: ${media_id} не существует`);
    }

    const comment = await Comment.create({
      username,
      media_id,
      comment_body,
      parent_comments_id,
      images_url,
    });

    await model.updateOne({ media_id }, { $push: { comments: comment._id } });

    return comment;
  }

  async editComment(
    commentId: number,
    comment_body: string,
    images_url: string[],
  ): Promise<ICommentModel> {
    const updatedComment = await Comment.findOneAndUpdate(
      { id: commentId, isDeleted: { $ne: true } },
      { comment_body, images_url },
      { new: true },
    );
    if (!updatedComment) {
      throw ApiError.BadRequest(
        `Комментарий с id:${commentId} не существует или он удален`,
      );
    }
    return updatedComment;
  }

  async delComment(commentId: number): Promise<ICommentModel> {
    const delComment = await Comment.findOneAndUpdate(
      { id: commentId, isDeleted: { $ne: true } },
      { isDeleted: true },
      { new: true },
    );
    if (!delComment) {
      throw ApiError.BadRequest(
        `Комментария с id:${commentId} не существует или он уже удален`,
      );
    }
    return delComment;
  }

  async restoreComment(commentId: number): Promise<ICommentModel> {
    const restoredComment = await Comment.findOneAndUpdate(
      { id: commentId, isDeleted: true },
      { isDeleted: false },
      { new: true },
    );
    if (!restoredComment) {
      throw ApiError.BadRequest(
        `Комментария с id:${commentId} не существует или он не удалён`,
      );
    }
    return restoredComment;
  }

  async setReactionComment() {
    console.log('Comment reacted');
  }
}
export default new CommentService();
