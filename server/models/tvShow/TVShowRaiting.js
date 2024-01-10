import { Schema, model } from "mongoose";

const tvShowRatingSchema = new Schema(
  {
    targetId: { type: Number, required: true },
    ratingValue: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const TVShowRating = model("TVShowRating", tvShowRatingSchema);

export default TVShowRating;
