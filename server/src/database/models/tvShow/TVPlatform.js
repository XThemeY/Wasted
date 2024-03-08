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
      .findOneAndUpdate({ _id: 'tvplatformid' }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const TVPlatform = model('TVPlatform', tvPlatformSchema);

export default TVPlatform;
