import {
  Comment,
  CommentsMovie,
  CommentsShow,
  CommentsSeason,
  CommentsEpisode,
  UserCommentReactions,
} from '#db/models/index.js';
import ApiError from '#utils/apiError.js';
import { CommentDto, CommentMediaDto } from '#utils/dtos/index.js';
import type { ICommentModel } from '#interfaces/IModel';
import type { FilterQuery } from 'mongoose';
import type { IAddCommentBody, ICommentsMedia } from '#interfaces/IApp';
import type { ICommentReactions } from '#interfaces/IFields';
import { CommentDelDto } from '#utils/dtos/commentDto';
import type { Comments } from '#types/types';
import mongoose from 'mongoose';

class CommentService {
  commentModels = {
    movie: CommentsMovie,
    tvshow: CommentsShow,
    season: CommentsSeason,
    episode: CommentsEpisode,
  };

  commentMediaTypes = Object.keys(this.commentModels);

  async getComment(commentId: number, username?: string): Promise<CommentDto> {
    const query: FilterQuery<ICommentModel> = { id: commentId };
    if (username) {
      query.username = username;
    }
    const comment = await Comment.findOne(query);
    if (!comment) {
      const errorMessage = username
        ? `Комментария с таким id:${commentId} у пользователя: ${username} не существует`
        : `Комментария с таким id:${commentId} не существует`;
      throw ApiError.BadRequest(errorMessage);
    }
    return new CommentDto(comment);
  }

  async getUserComments(
    username: string,
  ): Promise<{ username: string; comments: Comments }> {
    const comments = await Comment.find({ username });
    if (!comments.length) {
      throw ApiError.BadRequest(
        `Комментарии пользователя:${username} не найдены`,
      );
    }
    const commentsList = comments.map((item) => {
      if (!item.isDeleted) {
        return new CommentDto(item);
      }
      return new CommentDelDto(item);
    });

    return { username, comments: commentsList };
  }

  async getMediaComments(
    media_id: number,
    type: string,
  ): Promise<ICommentsMedia> {
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
    return new CommentMediaDto(comments);
  }

  async addComment(
    body: IAddCommentBody,
    username: string,
  ): Promise<CommentDto> {
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
      comment_body,
      parent_comments_id,
      images_url,
    });
    await model.updateOne({ media_id }, { $push: { comments: comment._id } });
    return new CommentDto(comment);
  }

  async editComment(
    id: number,
    comment_body: string,
    images_url: string[],
  ): Promise<CommentDto> {
    const updatedComment = await Comment.findOneAndUpdate(
      { id, isDeleted: { $ne: true } },
      { comment_body, images_url },
      { new: true },
    );
    if (!updatedComment) {
      throw ApiError.BadRequest(
        `Комментарий с id:${id} не существует или он удален`,
      );
    }
    return new CommentDto(updatedComment);
  }

  async delComment(commentId: number): Promise<CommentDto> {
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
    return new CommentDto(delComment);
  }

  async restoreComment(commentId: number): Promise<CommentDto> {
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
    return new CommentDto(restoredComment);
  }

  async setReactionComment(
    username: string,
    comment_id: number,
    reactions: [string],
  ): Promise<ICommentReactions> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const comment = await Comment.findOne({ id: comment_id })
        .session(session)
        .exec();
      if (!comment || comment.isDeleted) {
        throw ApiError.BadRequest(
          `Комментарий с id:${comment_id} не существует или удален`,
        );
      }

      const userReactions = await UserCommentReactions.exists({
        username,
        'comments.commentId': comment_id,
      });
      if (!userReactions) {
        await UserCommentReactions.updateOne(
          {
            username,
          },
          {
            $push: {
              comments: [
                {
                  commentId: comment_id,
                  reactions,
                },
              ],
            },
          },
          { runValidators: true },
        ).exec();
        reactions.forEach((reaction) => {
          comment.reactions[reaction].vote_count += 1;
        });
        await comment.save({ session });
      } else {
        const oldReactions = await UserCommentReactions.findOneAndUpdate(
          {
            username,
            'comments.commentId': comment_id,
          },
          {
            $set: {
              'comments.$.reactions': reactions,
            },
          },
          { runValidators: true },
        )
          .select('comments.$')
          .session(session)
          .exec();
        oldReactions.comments[0].reactions.forEach((reaction) => {
          comment.reactions[reaction].vote_count -= 1;
        });
        reactions.forEach((reaction) => {
          comment.reactions[reaction].vote_count += 1;
        });
        await comment.save({ session });
      }
      await session.commitTransaction();
      session.endSession();
      return comment.reactions;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return err;
    }
  }
}
export default new CommentService();
