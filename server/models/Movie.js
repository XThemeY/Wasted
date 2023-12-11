const { Schema, model } = require("mongoose");

const movieSchema = new Schema({
  id: { type: Number, unique: true, required: true },
  title: { type: String, required: true },
  originalTitle: { type: String, required: true },
  poster: { type: String, required: true },
  runtime: { type: Number, required: true },
  releaseDate: { type: String },
  description: { type: String },
  genres: [{ genre: { type: String } }],
  countries: [{ country: { type: String } }],
  director: { type: String },
  actors: [{ type: String }],
  ratings: {
    wasted: { type: Number, default: 0 },
    imdb: { type: Number, default: 0 },
    rottenTomatoes: { type: Number, default: 0 },
    kinopoisk: { type: Number, default: 0 },
  },
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

const Movie = model("Movie", movieSchema);

module.exports = Movie;
