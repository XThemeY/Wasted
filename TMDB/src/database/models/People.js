import { Schema, model } from 'mongoose';
import { CommentsPeople, Counters } from '#db/models/index.js';

const peopleSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
      immutable: true,
    },
    name: { type: String, required: true, index: true },
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
    //comments: { type: Schema.Types.ObjectId, ref: 'CommentsPeople' },
  },
  {
    timestamps: true,
  },
);

peopleSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counters.findOneAndUpdate(
      { _id: 'peopleid' },
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true },
    );
    this.id = counter.seq;
    //this.comments = (await CommentsPeople.create({ media_id: this.id }))._id;
  }
  next();
});

const People = model('People', peopleSchema);

export default People;
