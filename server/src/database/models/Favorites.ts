import type { IFavoriteModel } from '#interfaces/IModel';
import { Schema, model } from 'mongoose';

const favorites = new Schema(
  {
    username: {
      type: String,
      unique: true,
      immutable: true,
      required: true,
    },
    movies: [Number],
    tvShows: { shows: [Number], episodes: [Number] },
    games: [Number],
  },
  {
    timestamps: true,
  },
);

const Favorites = model<IFavoriteModel>('Favorites', favorites);

export default Favorites;
