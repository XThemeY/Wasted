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
    rating: { type: Number, default: 0, index: true },
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
    episodes: [{ type: Schema.Types.ObjectId, ref: 'Episode' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'CommentsSeason' }],
  },
  {
    timestamps: true,
  },
);

seasonSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await mongoose.connection
      .collection('counters')
      .findOneAndUpdate(
        { _id: 'seasonid' },
        { $inc: { seq: 1 } },
        { returnDocument: 'after', upsert: true },
      );
    this.id = counter.seq;
  }
  next();
});

const Season = model('Season', seasonSchema);

export default Season;
