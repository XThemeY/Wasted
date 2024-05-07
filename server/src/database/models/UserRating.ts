import { Schema, model } from 'mongoose';

const userRatingSchema = new Schema(
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

const UserRating = model('UserRating', userRatingSchema);

export default UserRating;
