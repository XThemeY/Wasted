import { Schema, model } from 'mongoose';

const userCommentReactionsSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      immutable: true,
      required: true,
    },
    comments: [{ commentId: Number, reactions: [] }],
  },
  {
    timestamps: true,
  },
);

const UserCommentReactions = model(
  'UserCommentReactions',
  userCommentReactionsSchema,
);

export default UserCommentReactions;
