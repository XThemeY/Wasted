import mongoose, { Schema, model } from 'mongoose';
const db = mongoose.connection;

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
  },
  {
    timestamps: true,
  },
);

peopleSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await db
      .collection('counters')
      .findOneAndUpdate({ _id: 'peopleid' }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const People = model('People', peopleSchema);

export default People;
