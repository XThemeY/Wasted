import mongoose, { Schema, model } from 'mongoose';

const publisherSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

publisherSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await mongoose.connection
      .collection('counters')
      .findOneAndUpdate(
        { _id: 'publisherid' },
        { $inc: { seq: 1 } },
        { returnDocument: 'after', upsert: true },
      );
    this.id = counter.seq;
  }
  next();
});

const Publisher = model('Publisher', publisherSchema);

export default Publisher;
