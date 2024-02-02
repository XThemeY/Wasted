import mongoose, { Schema, model } from 'mongoose';
const db = mongoose.connection;

const tvShowSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    title: { type: String, required: true },
    title_original: { type: String, default: '' },
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
    start_date: { type: Date, required: true },
    end_date: { type: Date },
    status: { type: String, default: '' },
    genres: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
    countries: [{ type: Schema.Types.ObjectId, ref: 'Country' }],
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
    description: { type: String, default: '' },
    description_original: { type: String, default: '' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    episode_duration: { type: Number, default: 0 },
    production_companies: [{ type: Schema.Types.ObjectId, ref: 'ProdCompany' }],
    number_of_seasons: { type: Number, default: 1 },
    number_of_episodes: { type: Number, default: 1 },
    platforms: [{ type: Schema.Types.ObjectId, ref: 'TVPlatform' }],
    seasons: [{ type: Schema.Types.ObjectId, ref: 'Season' }],
    ratings: {
      wasted: {
        raiting: { type: Number, default: 0 },
        beer: { type: Number, default: 0 },
        favorite: { type: Number, default: 0 },
        good: { type: Number, default: 0 },
        pokerface: { type: Number, default: 0 },
        poop: { type: Number, default: 0 },
      },
      tmdb: {
        raiting: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      imdb: {
        raiting: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      kinopoisk: {
        raiting: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
    },
    reactions: {
      broken_heart: { type: Number, default: 0 },
      clown_face: { type: Number, default: 0 },
      dislike: { type: Number, default: 0 },
      dizzy_face: { type: Number, default: 0 },
      face_vomiting: { type: Number, default: 0 },
      fire: { type: Number, default: 0 },
      grin: { type: Number, default: 0 },
      heart_eyes: { type: Number, default: 0 },
      heart: { type: Number, default: 0 },
      joy: { type: Number, default: 0 },
      like: { type: Number, default: 0 },
      muscle: { type: Number, default: 0 },
      neutral_face: { type: Number, default: 0 },
      rude_face: { type: Number, default: 0 },
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'CommentMovie' }],
    external_ids: {
      tmdb: { type: String },
      imdb: { type: String },
      kinopoisk: { type: String },
    },
    user_raitings: [{ type: Schema.Types.ObjectId, ref: 'MovieRating' }],
  },
  {
    timestamps: true,
  },
);

tvShowSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await db
      .collection('counters')
      .findOneAndUpdate({ _id: 'tvshowid' }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const TVShow = model('TVShow', tvShowSchema);

export default TVShow;
