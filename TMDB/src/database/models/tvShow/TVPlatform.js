import mongoose, { Schema, model } from 'mongoose';

const tvPlatformSchema = new Schema({
  id: { type: Number, unique: true, immutable: true },
  name: { type: String, required: true },
  logo_url: { type: String },
});

tvPlatformSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await mongoose.connection
      .collection('counters')
      .findOneAndUpdate(
        { _id: 'tvplatformid' },
        { $inc: { seq: 1 } },
        { returnDocument: 'after', upsert: true },
      );
    this.id = counter.seq;
  }
  next();
});

const TVPlatform = model('TVPlatform', tvPlatformSchema);

export default TVPlatform;
