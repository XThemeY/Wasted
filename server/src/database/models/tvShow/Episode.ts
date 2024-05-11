import { Schema, model } from 'mongoose';
import { CommentsEpisode } from '#db/models/index.js';
import type { IEpisodeModel } from '#interfaces/IModel';

const episodeSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    show_id: { type: Number, required: true },
    poster_url: { type: String, default: '' },
    title: { type: String, required: true },
    title_original: { type: String, default: '' },
    episode_type: { type: String },
    season_number: { type: Number },
    episode_number: { type: Number },
    duration: { type: Number },
    air_date: { type: Date },
    watch_count: { type: Number, default: 0 },
    description: { type: String, default: '' },
    description_original: { type: String, default: '' },
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
    comments: { type: Schema.Types.ObjectId, ref: 'CommentsEpisode' },
  },
  {
    timestamps: true,
  },
);

episodeSchema.virtual('tagsId', {
  ref: 'Tag',
  localField: 'tags',
  foreignField: 'id',
});

episodeSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.id = (await Episode.countDocuments()) + 1;
    this.comments = (await CommentsEpisode.create({ media_id: this.id }))._id;
  }
  next();
});

const Episode = model<IEpisodeModel>('Episode', episodeSchema);

export default Episode;
