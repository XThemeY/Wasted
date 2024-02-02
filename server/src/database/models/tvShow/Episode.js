import mongoose, { Schema, model } from 'mongoose';
const db = mongoose.connection;

const episodeSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    show_id: { type: Number, required: true },
    poster_url: { type: String, default: '' },
    title: { type: String, required: true },
    title_original: { type: String, default: '' },
    episode_type: { type: String, default: 'common' },
    season_number: { type: Number },
    episode_number: { type: Number },
    duration: { type: Number },
    release_date: { type: Date },
    watch_count: { type: Number, default: 0 },
    description: { type: String, default: '' },
    description_original: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'CommentTV' }],
    user_raitings: [{ type: Schema.Types.ObjectId, ref: 'EpisodeRating' }],
  },
  {
    timestamps: true,
  },
);

episodeSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await db
      .collection('counters')
      .findOneAndUpdate({ _id: 'episodeid' }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const Episode = model('Episode', episodeSchema);

export default Episode;
