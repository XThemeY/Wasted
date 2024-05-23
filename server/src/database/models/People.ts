import { Schema, model } from 'mongoose';
import type { IPeopleModel } from '#interfaces/IModel';

const peopleSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
      immutable: false,
    },
    original_name: { type: String, default: '' },
    translations: {
      ru: {
        type: String,
        default: '',
      },
      en: {
        type: String,
        default: '',
      },
    },
    profile_img: { type: String },
    movies: [
      {
        id: { type: Number },
        role: { type: String },
        job: { type: String },
      },
    ],
    shows: [
      {
        id: { type: Number },
        role: { type: String },
        job: { type: String },
      },
    ],
    tmdb_id: { type: Number, unique: true, immutable: true },
    comments: { type: Schema.Types.ObjectId, ref: 'CommentsPeople' },
    commentsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

const People = model<IPeopleModel>('People', peopleSchema);

export default People;
