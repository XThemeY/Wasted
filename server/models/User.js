const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, required: true },
  login: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  mail: { type: String, unique: true, required: true },
  birthdate: { type: Date },
  avatar: { type: String },
  roles: [
    {
      type: String,
      ref: "Role",
    },
  ],
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Movie",
    },
    {
      type: Schema.Types.ObjectId,
      ref: "tvShow",
    },
    {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
  ],
  wastedHistory: [
    {
      itemId: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
      },
      status: {
        type: String,
        enum: ["Watched", "Planning", "Dropped", "WatchedMultipleTimes"],
        default: "Planning",
      },
      date: { type: Date, default: Date.now },
      rating: { type: Number, min: 1, max: 5 },
    },
    {
      itemId: {
        type: Schema.Types.ObjectId,
        ref: "TVShow",
      },
      status: {
        type: String,
        enum: ["Watched", "Planning", "Dropped", "WatchedMultipleTimes"],
        default: "Planning",
      },
      date: { type: Date, default: Date.now },
      rating: { type: Number, min: 1, max: 5 },
    },
    {
      itemId: {
        type: Schema.Types.tv,
        ref: "Game",
      },
      status: {
        type: String,
        enum: ["Played", "Planning", "Dropped", "PlayedMultipleTimes"],
        default: "Planning",
      },
      date: { type: Date, default: Date.now },
      rating: { type: Number, min: 1, max: 5 },
    },
  ],
  socialProfiles: {
    facebook: { type: String },
    twitter: { type: String },
    vk: { type: String },
    discord: { type: String },
  },
  gameProfiles: {
    psn: { type: String },
    xbox: { type: String },
    steam: { type: String },
    nintendo: { type: String },
  },
});

const User = model("User", UserSchema);

module.exports = User;
