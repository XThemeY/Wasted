import { Schema, model, mongoose } from "mongoose";
const db = mongoose.connection;

const UserSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      immutable: true,
      default: 0,
    },
    username: { type: String, required: true },
    login: { type: String, unique: true, required: true, immutable: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true, trim: true },
    birthdate: { type: Date },
    avatarUrl: { type: String },
    gender: {
      type: String,
      enum: ["male", "female", "unknown"],
      default: "unknown",
    },
    roles: [{ type: Schema.Types.ObjectId, ref: "Role", required: true }],
    favorites: {
      movies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
      tvShows: [{ type: Schema.Types.ObjectId, ref: "tvShow" }],
      games: [{ type: Schema.Types.ObjectId, ref: "Game" }],
    },

    // wastedHistory: [
    //   {
    //     itemId: {
    //       type: Schema.Types.ObjectId,
    //       ref: "Movie",
    //     },
    //     status: {
    //       type: String,
    //       enum: ["Watched", "Planning", "Dropped", "WatchedMultipleTimes"],
    //       default: "Planning",
    //     },
    //     date: { type: Date, default: Date.now },
    //     rating: { type: Number, min: 1, max: 5 },
    //   },
    //   {
    //     itemId: {
    //       type: Schema.Types.ObjectId,
    //       ref: "TVShow",
    //     },
    //     status: {
    //       type: String,
    //       enum: ["Watched", "Planning", "Dropped", "WatchedMultipleTimes"],
    //       default: "Planning",
    //     },
    //     date: { type: Date, default: Date.now },
    //     rating: { type: Number, min: 1, max: 5 },
    //   },
    //   {
    //     itemId: {
    //       type: Schema.Types.tv,
    //       ref: "Game",
    //     },
    //     status: {
    //       type: String,
    //       enum: ["Played", "Planning", "Dropped", "PlayedMultipleTimes"],
    //       default: "Planning",
    //     },
    //     date: { type: Date, default: Date.now },
    //     rating: { type: Number, min: 1, max: 5 },
    //   },
    // ],
    // socialProfiles: {
    //   facebook: { type: String },
    //   twitter: { type: String },
    //   vk: { type: String },
    //   discord: { type: String },
    // },
    // gameProfiles: {
    //   psn: { type: String },
    //   xbox: { type: String },
    //   steam: { type: String },
    //   nintendo: { type: String },
    // },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await db
      .collection("counters")
      .findOneAndUpdate({ _id: "userid" }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const User = model("User", UserSchema);

export default User;
