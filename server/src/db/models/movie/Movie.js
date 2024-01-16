import mongoose, { Schema, model } from 'mongoose';
const db = mongoose.connection;

const movieSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    title: { type: String, required: true },
    originalTitle: { type: String, required: true },
    posterUrl: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    genres: [{ type: String }],
    countries: [{ type: String }],
    director: [{ type: String }],
    cast: [{ type: String }],
    watchCount: { type: Number, default: 0 },
    description: { type: String },
    tags: [{ type: String }],
    duration: { type: Number },
    ratings: {
      wasted: { type: Number, default: 0 },
      imdb: { type: Number, default: 0 },
      rottenTomatoes: { type: Number, default: 0 },
      kinopoisk: { type: Number, default: 0 },
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'CommentMovie' }],
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
  },
);

movieSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await db
      .collection('counters')
      .findOneAndUpdate({ _id: 'movieid' }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const Movie = model('Movie', movieSchema);

export default Movie;
