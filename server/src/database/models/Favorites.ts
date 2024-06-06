import type { IFavoriteModel } from '#interfaces/IModel';
import { Schema, model } from 'mongoose';

const favoritesSchema = new Schema(
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

favoritesSchema.set('toObject', { virtuals: true });
favoritesSchema.set('toJSON', { virtuals: true });
favoritesSchema.virtual('favoriteMovies', {
  ref: 'Movie',
  localField: 'movies',
  foreignField: 'id',
});

favoritesSchema.virtual('favoriteShows.shows', {
  ref: 'TVShow',
  localField: 'tvShows.shows',
  foreignField: 'id',
});

favoritesSchema.virtual('favoriteShows.episodes', {
  ref: 'Episode',
  localField: 'tvShows.episodes',
  foreignField: 'id',
});

const Favorites = model<IFavoriteModel>('Favorites', favoritesSchema);

export default Favorites;
