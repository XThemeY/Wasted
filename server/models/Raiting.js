const { Schema, model } = require("mongoose");

const ratingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  itemType: {
    type: String,
    enum: ["Movie", "TVShow", "Game"],
    required: true,
  },
  value: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
});

const Rating = model("Rating", ratingSchema);

module.exports = Rating;
