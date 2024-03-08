import mongoose, { Schema, model } from 'mongoose';

const seasonSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    show_id: { type: Number, required: true },
    title: { type: String },
    title_original: { type: String, default: '' },
    poster_url: { type: String, default: '' },
    season_number: { type: Number },
    episode_count: { type: Number },
    description: { type: String, default: '' },
    description_original: { type: String, default: '' },
    air_date: { type: Date },
    rating: { type: Number, default: 0 },
    episodes: [{ type: Schema.Types.ObjectId, ref: 'Episode' }],
    user_ratings: [{ type: Schema.Types.ObjectId, ref: 'SeasonRating' }],
  },
  {
    timestamps: true,
  },
);

seasonSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await mongoose.connection
      .collection('counters')
      .findOneAndUpdate({ _id: 'seasonid' }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const Season = model('Season', seasonSchema);

export default Season;
