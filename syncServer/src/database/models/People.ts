import { Schema, model } from 'mongoose';
import { CommentsPeople, Counter } from '#db/models/index.js';

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
    this.id = (
      await Counter.findOneAndUpdate(
        { _id: 'peopleid' },
        { $inc: { count: 1 } },
        { returnDocument: 'after', upsert: true },
      )
    ).count;
    this.comments = (await CommentsPeople.create({ media_id: this.id }))._id;
  }
  next();
});

const People = model('People', peopleSchema);

export default People;
