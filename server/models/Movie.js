import { Schema, model } from "mongoose";

const movieSchema = new Schema(
  {
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
    ratings: {
      wasted: { type: Number, default: 0 },
      imdb: { type: Number, default: 0 },
      rottenTomatoes: { type: Number, default: 0 },
      kinopoisk: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

movieSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await db
      .collection("counters")
      .findOneAndUpdate({ _id: "movieid" }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const Movie = model("Movie", movieSchema);

export default Movie;
