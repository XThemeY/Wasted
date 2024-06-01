import type { IComment, ICommentsMedia } from '#interfaces/IApp';
import type { ICommentReactions } from '#interfaces/IFields';
import type { ICommentModel, ICommentsMediaModel } from '#interfaces/IModel';
import { Comments } from '#types/types';

export class CommentDto implements IComment {
  id: number;
  username: string;
  parent_comments_id: number;
  comment_body: string;
  images_url: string[];
  isDeleted: boolean;
  isHidden: boolean;
  isChanged: boolean;
  createdAt: Date;
  updatedAt: Date;
  reactions: ICommentReactions;
  constructor(model: ICommentModel) {
    this.id = model.id;
    this.username = model.username;
    this.parent_comments_id = model.parent_comments_id;
    this.comment_body = model.comment_body;
    this.images_url = model.images_url;
    this.isDeleted = model.isDeleted;
    this.isHidden = model.isHidden;
    this.isChanged = model.isChanged;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
    this.reactions = model.reactions;
  }
}

export class CommentDelDto {
  id: number;
  isDeleted: boolean;
  constructor(model: ICommentModel) {
    this.id = model.id;
    this.isDeleted = model.isDeleted;
  }
}

export class CommentMediaDto implements ICommentsMedia {
  media_id: number;
  comments: Comments;
  constructor(model: ICommentsMediaModel) {
    this.media_id = model.media_id;
    this.comments = this.getComments(model.comments);
  }

  getComments(comments: ICommentModel[]): Comments {
    const commentsList = comments.map((item) => {
      if (!item.isDeleted) {
        return new CommentDto(item);
      }
      return new CommentDelDto(item);
    });
    return commentsList;
  }
}
