import { Schema, model } from 'mongoose';
import type { IShowModel } from '#interfaces/IModel.d.ts';

const tvShowSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true, index: true },
    title: { type: String, required: true, index: true },
    title_original: { type: String, default: '', index: true },
    images: {
      poster_url: {
        ru: { type: String, default: '' },
        en: { type: String, default: '' },
      },
      logo_url: {
        ru: { type: String, default: '' },
        en: { type: String, default: '' },
      },
      backdrop_url: { type: String, default: '' },
    },
    start_date: { type: Date, index: true },
    end_date: { type: Date, index: true },
    status: {
      type: String,
      enum: [
        'Canceled',
        'Ended',
        'Returning Series',
        'Pilot',
        'In Production',
        'Planned',
      ],
      default: '',
    },
    genres: { type: [Number], index: true },
    countries: { type: [Number], index: true },
    creators: [
      {
        person: { type: Schema.Types.ObjectId, ref: 'People' },
        role: { type: String },
      },
    ],
    cast: [
      {
        person: { type: Schema.Types.ObjectId, ref: 'People' },
        role: { type: String },
      },
    ],
    watch_count: { type: Number, default: 0 },
    total_episodes_time: { type: Number, default: 0 },
    episode_duration: { type: Number, default: 0 },
    number_of_seasons: { type: Number, default: 0 },
    number_of_episodes: { type: Number, default: 0 },
    description: { type: String, default: '' },
    description_original: { type: String, default: '' },
    tags: { type: [Number], index: true },
    production_companies: { type: [Number], index: true },
    platforms: { type: [Number], index: true },
    seasons: [{ type: Schema.Types.ObjectId, ref: 'Season' }],
    rating: { type: Number, default: 0, index: true },
    ratings: {
      tmdb: {
        rating: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      imdb: {
        rating: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      kinopoisk: {
        rating: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
    },
    reactions: {
      shocked: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      thrilled: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      scared: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      sad: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      touched: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      bored: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      confused: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      amused: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      tense: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      reflective: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
    },
    comments: { type: Schema.Types.ObjectId, ref: 'CommentsShow' },
    commentsCount: { type: Number, default: 0 },
    external_ids: {
      tmdb: { type: Number },
      imdb: { type: String },
      kinopoisk: { type: Number },
    },
    type: { type: String, enum: ['movie', 'show', 'game'], default: 'show' },
    popularity: { type: Number, default: 0, index: true },
  },
  {
    timestamps: true,
  },
);

tvShowSchema.set('toObject', { virtuals: true });
tvShowSchema.set('toJSON', { virtuals: true });

tvShowSchema.virtual('countriesId', {
  ref: 'Country',
  localField: 'countries',
  foreignField: 'id',
});

tvShowSchema.virtual('genresId', {
  ref: 'Genre',
  localField: 'genres',
  foreignField: 'id',
});

tvShowSchema.virtual('production_companiesId', {
  ref: 'ProdCompany',
  localField: 'production_companies',
  foreignField: 'id',
});

tvShowSchema.virtual('tagsId', {
  ref: 'Tag',
  localField: 'tags',
  foreignField: 'id',
});

tvShowSchema.virtual('platformsId', {
  ref: 'TVPlatform',
  localField: 'platforms',
  foreignField: 'id',
});

const TVShow = model<IShowModel>('TVShow', tvShowSchema);

export default TVShow;
