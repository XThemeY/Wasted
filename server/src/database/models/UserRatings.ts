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

userRatingsSchema.set('toObject', { virtuals: true });
userRatingsSchema.set('toJSON', { virtuals: true });

userRatingsSchema.virtual('ratingsMovies', {
  ref: 'Movie',
  localField: 'movies.itemId',
  foreignField: 'id',
});

userRatingsSchema.virtual('ratingsShows.tvShows.episodes', {
  ref: 'Episode',
  localField: 'tvShows.episodes.itemId',
  foreignField: 'id',
});

const UserRatings = model<IUserRatingsModel>('UserRatings', userRatingsSchema);

export default UserRatings;
