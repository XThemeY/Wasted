import type { IWastedHistoryModel } from '#interfaces/IModel';
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
        itemId: Number,
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
        itemId: Number,
        status: {
          type: String,
          enum: ['willWatch', 'watching', 'dropped', 'notWatched'],
          default: 'notWatched',
        },
        watchedEpisodes: [
          {
            itemId: Number,
            seasonNumber: Number,
            watchedAt: { type: Date, default: Date.now },
            watchCount: { type: Number, default: 1 },
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
          enum: ['played', 'willPlay', 'dropped'],
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

const WastedHistory = model<IWastedHistoryModel>(
  'WastedHistory',
  wastedHistory,
);

export default WastedHistory;
