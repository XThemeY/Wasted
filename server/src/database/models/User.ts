import { Schema, model } from 'mongoose';
import moment from 'moment-timezone';
import {
  WastedHistory,
  Favorites,
  UserRatings,
  UserReactions,
  UserCommentReactions,
  Counter,
} from '#db/models/index.js';

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
    favorites: { type: Schema.Types.ObjectId, ref: 'Favorites', unique: true },
    ratings: { type: Schema.Types.ObjectId, ref: 'UserRating', unique: true },
    reactions: {
      type: Schema.Types.ObjectId,
      ref: 'UserReactions',
      unique: true,
    },
    wastedHistory: {
      type: Schema.Types.ObjectId,
      ref: 'WastedHistory',
      unique: true,
    },
    commentReactions: {
      type: Schema.Types.ObjectId,
      ref: 'CommentReactions',
      unique: true,
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
      birthdate: { type: Date },
      avatarUrl: { type: String },
      userRoles: [
        {
          type: String,
          required: true,
          default: 'User',
        },
      ],
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
    this.id = (
      await Counter.findOneAndUpdate(
        { _id: 'userid' },
        { $inc: { count: 1 } },
        { returnDocument: 'after', upsert: true },
      )
    ).count;
    this.wastedHistory = (
      await WastedHistory.create({ username: this.username })
    )._id;
    this.favorites = (await Favorites.create({ username: this.username }))._id;
    this.ratings = (await UserRatings.create({ username: this.username }))._id;
    this.reactions = (
      await UserReactions.create({ username: this.username })
    )._id;
    this.commentReactions = (
      await UserCommentReactions.create({ username: this.username })
    )._id;
  }
  next();
});

const User = model('User', userSchema);

export default User;
