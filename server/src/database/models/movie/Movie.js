import mongoose, { Schema, model } from 'mongoose';
import { CommentsMovie } from '#db/models/index.js';

const movieSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
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
    release_date: { type: Date, index: true },
    genres: [Number],
    countries: [Number],
    director: [
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
    description: { type: String, default: '' },
    description_original: { type: String, default: '' },
    tags: [Number],
    duration: { type: Number, default: 0 },
    production_companies: [Number],
    rating: { type: Number, default: 0, index: true },
    ratings: {
      wasted: {
        beer: { type: Number, default: 0 },
        favorite: { type: Number, default: 0 },
        good: { type: Number, default: 0 },
        pokerface: { type: Number, default: 0 },
        poop: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
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
    comments: [{ type: Schema.Types.ObjectId, ref: 'CommentsMovie' }],
    external_ids: {
      tmdb: { type: String },
      imdb: { type: String },
      kinopoisk: { type: String },
    },
    type: { type: String, enum: ['movie', 'show', 'game'], default: 'movie' },
    popularity: { type: Number, default: 0, index: true },
  },
  {
    timestamps: true,
  },
);

movieSchema.set('toObject', { virtuals: true });
movieSchema.set('toJSON', { virtuals: true });

movieSchema.virtual('countriesId', {
  ref: 'Country',
  localField: 'countries',
  foreignField: 'id',
});

movieSchema.virtual('genresId', {
  ref: 'Genre',
  localField: 'genres',
  foreignField: 'id',
});

movieSchema.virtual('production_companiesId', {
  ref: 'ProdCompany',
  localField: 'production_companies',
  foreignField: 'id',
});

movieSchema.virtual('tagsId', {
  ref: 'Tag',
  localField: 'tags',
  foreignField: 'id',
});

movieSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await mongoose.connection
      .collection('counters')
      .findOneAndUpdate(
        { _id: 'movieid' },
        { $inc: { seq: 1 } },
        { returnDocument: 'after', upsert: true },
      );
    this.id = counter.seq;
    this.comments = (await CommentsMovie.create({ media_id: this.id }))._id;
  }
  next();
});

const Movie = model('Movie', movieSchema);

export default Movie;
