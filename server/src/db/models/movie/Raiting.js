import { Schema, model } from 'mongoose';

const movieRatingSchema = new Schema(
  {
    targetId: { type: Number, required: true },
    ratingValue: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

const MovieRating = model('MovieRating', movieRatingSchema);

export default MovieRating;
