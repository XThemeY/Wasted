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
      kinopoisk: { type: Number, default: 0 },
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'CommentMovie' }],
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

export const getMovieById = async (id) => {
  const movie = await Movie.findOne({ id });
  if (!movie) {
    return null;
  }
  const movieObj = setFields(movie);
  return movieObj;
};

export const getMovieAll = async () => {
  const movies = await Movie.find({});
  if (!movies) {
    return null;
  }
  const totalCount = await Movie.countDocuments({});
  const moviesObj = { items: [], total_items: totalCount };
  movies.forEach((movie) => {
    moviesObj.items.push(setFields(movie));
  });

  return moviesObj;
};

const setFields = (item) => {
  const newObj = {
    id: item.id,
    title: item.title,
    originalTitle: item.originalTitle,
    posterUrl: item.posterUrl,
    releaseDate: item.releaseDate,
    genres: item.genres,
    countries: item.countries,
    director: item.director,
    cast: item.cast,
    watchCount: item.watchCount,
    description: item.description,
    tags: item.tags,
    duration: item.duration,
    ratings: {
      wasted: item.ratings.wasted,
      imdb: item.ratings.imdb,
      kinopoisk: item.ratings.kinopoisk,
    },
    comments: item.comments,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
  return newObj;
};
