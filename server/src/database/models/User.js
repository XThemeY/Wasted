import mongoose, { Schema, model } from 'mongoose';
import moment from 'moment-timezone';

const timezones = moment.tz.names();
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
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role', required: true }],
    favorites: { type: Schema.Types.ObjectId, ref: 'Favorites' },
    wastedHistory: { type: Schema.Types.ObjectId, ref: 'WastedHistory' },
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
      birthdate: { type: Date },
      avatarUrl: { type: String },
      gender: {
        type: String,
        enum: ['male', 'female', 'unknown'],
        default: 'unknown',
      },
      theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
      country: { type: String },
      language: {
        type: String,
        enum: ['Russian', 'English'],
        default: 'Russian',
      },
      timeZone: {
        type: String,
        enum: timezones,
        default: 'UTC',
      },
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

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

userSchema.virtual('favoriteMovies', {
  ref: 'Movie',
  localField: 'favorites.movies',
  foreignField: 'id',
});

userSchema.virtual('favoriteShows', {
  ref: 'TVShow',
  localField: 'favorites.tvShows',
  foreignField: 'id',
});

userSchema.virtual('wastedhistory.movies', {
  ref: 'Movie',
  localField: 'wastedHistory.movies.itemId',
  foreignField: 'id',
});

userSchema.virtual('wastedhistory.tvShows', {
  ref: 'TVShow',
  localField: 'wastedHistory.tvShows.showId',
  foreignField: 'id',
});

userSchema.virtual('wastedhistory.tvShows.watchedEpisodes', {
  ref: 'Episode',
  localField: 'wastedHistory.tvShows.watchedEpisodes.episodeId',
  foreignField: 'id',
});

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await mongoose.connection
      .collection('counters')
      .findOneAndUpdate({ _id: 'userid' }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const User = model('User', userSchema);

export default User;
