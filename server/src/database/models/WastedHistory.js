import { Schema, model } from 'mongoose';

const wastedHistory = new Schema(
  {
    username: {
      type: String,
      unique: true,
      immutable: true,
      required: true,
    },
    movies: [
      {
        movieId: Number,
        status: {
          type: String,
          enum: ['watched', 'willWatch', 'dropped', 'notWatched'],
          default: 'notWatched',
        },
        watchCount: { type: Number, default: 1 },
        watchedAt: { type: Date, default: Date.now },
      },
    ],
    tvShows: [
      {
        showId: Number,
        status: {
          type: String,
          enum: ['willWatch', 'watching', 'dropped', 'notWatched'],
          default: 'notWatched',
        },
        watchedEpisodes: [
          {
            episodeId: Number,
            watchedAt: { type: Date, default: Date.now },
            watchCount: { type: Number, default: 1 },
          },
        ],
      },
    ],
    games: [
      {
        gameId: {
          type: Schema.Types.ObjectId,
          ref: 'Game',
        },
        status: {
          type: String,
          enum: ['played', 'planning', 'dropped'],
        },
        playedCount: { type: Number, default: 1 },
        playedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const WastedHistory = model('WastedHistory', wastedHistory);

export default WastedHistory;
