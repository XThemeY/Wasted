import mongoose, { Schema, model } from 'mongoose'
const db = mongoose.connection

const UserSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
      immutable: true,
      default: 0,
    },
    username: { type: String, required: true, immutable: true },
    email: { type: String, unique: true, required: true, trim: true },
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
    authentication: {
      password: { type: String, required: true, select: false },
      sessionToken: { type: String, select: false },
    },
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
  },
)

UserSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await db
      .collection('counters')
      .findOneAndUpdate({ _id: 'userid' }, { $inc: { seq: 1 } })
    this.id = counter.seq + 1
  }
  next()
})

const User = model('User', UserSchema)

export const getUsersCount = () => User.countDocuments()
export const getUserAll = () => User.find()
export const getUserByEmail = (email) => User.findOne({ email })
export const getUserByUsername = (username) => User.findOne({ username })
export const getUserBySessionToken = (sessionToken) =>
  User.findOne({ 'authentication.sessionToken': sessionToken })
export const getUserById = (id) => User.findOne({ id })
export const createUser = (values) =>
  new User(values).save().then((user) => user.toObject())
export const deleteUserById = (id) => User.findOneAndDelete({ id })
export const updateUserById = (id, values) =>
  User.findOneAndUpdate({ id }, values)
