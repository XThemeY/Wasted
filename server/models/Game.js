const { Schema, model } = require("mongoose");

const gameSchema = new Schema({
  title: { type: String, required: true },
  originalTitle: { type: String, required: true },
  poster: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  platform: { type: String, required: true },
  developers: [{ type: String }],
  publishers: [{ type: String }],
  ratings: {
    wasted: { type: Number, default: 0 },
    metacritic: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: [
      "Played",
      "Planning",
      "Dropped",
      "InProgress",
      "PassedMultipleTimes",
      "OnHold",
    ],
  },
});

const Game = model("Game", gameSchema);

module.exports = Game;
