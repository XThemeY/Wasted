import type { IUserCommentReactionsModel } from '#interfaces/IModel';
import { Schema, model } from 'mongoose';

const userCommentReactionsSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      immutable: true,
      required: true,
    },
    comments: [{ commentId: Number, reactions: [String] }],
  },
  {
    timestamps: true,
  },
);

const UserCommentReactions = model<IUserCommentReactionsModel>(
  'UserCommentReactions',
  userCommentReactionsSchema,
);

export default UserCommentReactions;
