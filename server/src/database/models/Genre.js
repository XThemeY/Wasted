import mongoose, { Schema, model } from 'mongoose';

const genreSchema = new Schema({
  id: { type: Number, unique: true, immutable: true },
  ru: { type: String, required: true },
  en: { type: String, required: true },
});

genreSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await mongoose.connection
      .collection('counters')
      .findOneAndUpdate(
        { _id: 'genreid' },
        { $inc: { seq: 1 } },
        { returnDocument: 'after', upsert: true },
      );
    this.id = counter.seq;
  }
  next();
});

const Genre = model('Genre', genreSchema);

export default Genre;
