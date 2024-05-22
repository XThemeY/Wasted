import type { IUserRatingsModel } from '#interfaces/IModel';
import { Schema, model } from 'mongoose';

const userRatingsSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      immutable: true,
      required: true,
    },
    movies: [{ itemId: Number, rating: Number, ratingName: String }],
    tvShows: {
      episodes: [{ itemId: Number, rating: Number, ratingName: String }],
    },
    games: [{ itemId: Number, rating: Number, ratingName: String }],
  },
  {
    timestamps: true,
  },
);

const UserRatings = model<IUserRatingsModel>('UserRatings', userRatingsSchema);

export default UserRatings;
