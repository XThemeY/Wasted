import mongoose, { Schema, model } from 'mongoose'
const db = mongoose.connection

const tvShowSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    title: { type: String, required: true },
    originalTitle: { type: String },
    posterUrl: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    genres: [{ type: String }],
    countries: [{ type: String }],
    director: [{ type: String }],
    cast: [{ type: String }],
    platforms: [{ type: String }],
    watchCount: { type: Number, default: 0 },
    description: { type: String },
    tags: [{ type: String }],
    seasons: [
      {
        seasonNumber: { type: Number, required: true },
        episodes: [{ type: Schema.Types.ObjectId, ref: 'Episode' }],
      },
    ],
    ratings: {
      wasted: { type: Number, default: 0 },
      imdb: { type: Number, default: 0 },
      rottenTomatoes: { type: Number, default: 0 },
      kinopoisk: { type: Number, default: 0 },
    },
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
  },
)

tvShowSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await db
      .collection('counters')
      .findOneAndUpdate({ _id: 'tvshowid' }, { $inc: { seq: 1 } })
    this.id = counter.seq + 1
  }
  next()
})

const TVShow = model('TVShow', tvShowSchema)

export default TVShow

export function findOne({ id }) {
  throw new Error('Function not implemented.')
}

export function find({}) {
  throw new Error('Function not implemented.')
}

export function countDocuments({}) {
  throw new Error('Function not implemented.')
}
