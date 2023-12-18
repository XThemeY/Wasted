import { Schema, model } from "mongoose";

const tvShowSchema = new Schema(
  {
    id: { type: Number, unique: true, required: true },
    title: { type: String, required: true },
    originalTitle: { type: String, required: true },
    poster: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String },
    releaseYear: { type: Number },
    country: { type: String },
    director: { type: String },
    actors: [{ type: String }],
    seasons: { type: Number },
    episodesPerSeason: { type: Number },
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
  },
  {
    timestamps: true,
  }
);

tvShowSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await db
      .collection("counters")
      .findOneAndUpdate({ _id: "tvshowid" }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const TVShow = model("TVShow", tvShowSchema);

export default TVShow;
