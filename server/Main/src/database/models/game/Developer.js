import mongoose, { Schema, model } from 'mongoose';

const developerSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

developerSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await mongoose.connection
      .collection('counters')
      .findOneAndUpdate(
        { _id: 'developerid' },
        { $inc: { seq: 1 } },
        { returnDocument: 'after', upsert: true },
      );
    this.id = counter.seq;
  }
  next();
});

const Developer = model('Developer', developerSchema);

export default Developer;
