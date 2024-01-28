import { Schema, model } from 'mongoose';

const ratingSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    target_id: { type: Number, required: true },
    rating_value: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

const MovieRating = model('MovieRating', ratingSchema);
const ShowRating = model('ShowRating', ratingSchema);
const GameRating = model('GameRating', ratingSchema);

export { MovieRating, ShowRating, GameRating };
