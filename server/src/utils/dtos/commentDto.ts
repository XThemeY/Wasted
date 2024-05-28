import { IReactions } from '#interfaces/IFields';
import { Types } from 'mongoose';

export class CommentDto {
  id: number;
  username: string;
  parent_comments_id: number;
  comment_body: string;
  images_url: string[];
  reactions: IReactions;
  isDeleted: boolean;
  isHidden: boolean;
  isChanged: boolean;
  createdAt: Date;
  updatedAt: Date;
  _id: Types.ObjectId;
  constructor(model) {
    this.id = model.id;
    this.media_id = model.media_id;
    this.username = model.username;
    this.parent_comments_id = model.parent_comments_id;
    this.comment_body = model.comment_body;
    this.images_url = model.images_url;
    this.reactions = model.reactions;
    this.isDeleted = model.isDeleted;
    this.isHidden = model.isHidden;
    this.isChanged = model.isChanged;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
    this._id = model._id;
  }
}
