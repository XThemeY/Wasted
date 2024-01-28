import mongoose, { Schema, model } from 'mongoose';
const db = mongoose.connection;

const userSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
      immutable: true,
    },
    username: { type: String, required: true, immutable: true },
    email: { type: String, unique: true, required: true, trim: true },
    authentication: {
      password: { type: String, required: true },
      activationLink: { type: String },
      isActivated: { type: Boolean, default: false },
    },
    birthdate: { type: Date },
    avatarUrl: { type: String },
    gender: {
      type: String,
      enum: ['male', 'female', 'unknown'],
      default: 'unknown',
    },
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role', required: true }],
    favorites: {
      movies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
      tvShows: [{ type: Schema.Types.ObjectId, ref: 'TVShow' }],
      games: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
    },
    wastedHistory: {
      movies: [
        {
          itemId: {
            type: Schema.Types.ObjectId,
            ref: 'Movie',
          },
          status: {
            type: String,
            enum: ['Watched', 'Planning', 'Dropped', 'WatchedMultipleTimes'],
          },
          watchCount: { type: Number, default: 0 },
          watchedAt: { type: Date, default: Date.now },
        },
      ],
      tvShows: [
        {
          itemId: {
            type: Schema.Types.ObjectId,
            ref: 'TVShow',
          },
          status: {
            type: String,
            enum: ['Watched', 'Planning', 'Dropped', 'WatchedMultipleTimes'],
          },
          watchedEpisodes: [
            {
              episodeId: { type: Schema.Types.ObjectId, ref: 'Episode' },
              watchedAt: { type: Date, default: Date.now },
              watchCount: { type: Number, default: 0 },
            },
          ],
        },
      ],
      games: [
        {
          itemId: {
            type: Schema.Types.ObjectId,
            ref: 'Game',
          },
          status: {
            type: String,
            enum: ['Played', 'Planning', 'Dropped', 'PlayedMultipleTimes'],
          },
          playedCount: { type: Number, default: 0 },
          playedAt: { type: Date, default: Date.now },
        },
      ],
    },
    socialProfiles: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      vk: { type: String },
      discord: { type: String },
    },
    gameProfiles: {
      psn: { type: String },
      xbox: { type: String },
      steam: { type: String },
      nintendo: { type: String },
    },
    settings: {
      theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
      country: { type: String },
      language: { type: String, default: 'Russian' },
      timeZone: { type: String, default: 'UTC' },
      privacy: {
        showProfileTo: {
          type: String,
          enum: ['everyone', 'friends', 'no_one'],
          default: 'everyone',
        },
        shareWastedHistory: { type: Boolean, default: true },
      },

      notifications: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await db
      .collection('counters')
      .findOneAndUpdate({ _id: 'userid' }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const User = model('User', userSchema);

export default User;
