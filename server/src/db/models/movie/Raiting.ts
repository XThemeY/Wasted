import { Schema, model } from 'mongoose';

const movieRatingSchema = new Schema(
  {
    targetId: { type: Number, required: true },
    ratingValue: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
  },
);

const MovieRating = model('MovieRating', movieRatingSchema);

export default MovieRating;
