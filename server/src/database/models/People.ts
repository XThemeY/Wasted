import { Schema, model } from 'mongoose';
import { CommentsPeople } from '#db/models/index.js';
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
  },
  {
    timestamps: true,
  },
);

peopleSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.id = (await People.countDocuments()) + 1;
    this.comments = (await CommentsPeople.create({ media_id: this.id }))._id;
  }
  next();
});

const People = model<IPeopleModel>('People', peopleSchema);

export default People;
