const { Schema, model } = require("mongoose");

const tvShowSchema = new Schema({
  title: { type: String, required: true },
  originalTitle: { type: String, required: true },
  poster: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  country: { type: String, required: true },
  director: { type: String, required: true },
  actors: [{ type: String }],
  seasons: { type: Number, required: true },
  episodesPerSeason: { type: Number, required: true },
  ratings: {
    wasted: { type: Number, default: 0 },
    imdb: { type: Number, default: 0 },
    rottenTomatoes: { type: Number, default: 0 },
    kinopoisk: { type: Number, default: 0 },
  },
  platforms: [{ type: String }],
  status: {
    type: String,
    enum: [
      "Watched",
      "Planning",
      "Dropped",
      "InProgress",
      "WatchedMultipleTimes",
      "OnHold",
    ],
  },
});

const TVShow = model("TVShow", tvShowSchema);

module.exports = TVShow;
