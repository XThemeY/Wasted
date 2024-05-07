import { Schema, model } from 'mongoose';

const userReactionsSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      immutable: true,
      required: true,
    },
    movies: [{ itemId: Number, reactions: [] }],
    tvShows: {
      episodes: [{ itemId: Number, reactions: [] }],
    },
    games: [{ itemId: Number, reactions: [] }],
  },
  {
    timestamps: true,
  },
);

const UserReactions = model('UserReactions', userReactionsSchema);

export default UserReactions;
