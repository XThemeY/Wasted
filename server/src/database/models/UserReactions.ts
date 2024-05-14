import type { IUserReactionsModel } from '#interfaces/IModel';
import { Schema, model } from 'mongoose';

const userReactionsSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      immutable: true,
      required: true,
    },
    movies: [{ itemId: Number, reactions: [String] }],
    tvShows: {
      episodes: [{ itemId: Number, reactions: [String] }],
    },
    games: [{ itemId: Number, reactions: [String] }],
  },
  {
    timestamps: true,
  },
);

const UserReactions = model<IUserReactionsModel>(
  'UserReactions',
  userReactionsSchema,
);

export default UserReactions;
