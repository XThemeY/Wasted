import { Schema, model } from 'mongoose';

const episodeRatingSchema = new Schema(
  {
    targetId: { type: Number, required: true },
    ratingValue: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

const EpisodeRating = model('EpisodeRating', episodeRatingSchema);

export default EpisodeRating;
