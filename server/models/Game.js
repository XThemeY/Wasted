import { Schema, model } from "mongoose";

const gameSchema = new Schema(
  {
    id: { type: Number, unique: true, required: true },
    title: { type: String, required: true },
    originalTitle: { type: String, required: true },
    poster: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String },
    releaseYear: { type: Number },
    platform: { type: String },
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
  },
  {
    timestamps: true,
  }
);

gameSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await db
      .collection("counters")
      .findOneAndUpdate({ _id: "gameid" }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const Game = model("Game", gameSchema);

export default Game;
