import { Schema, model } from 'mongoose';
import { Counters } from '#db/models/index.js';

const tvPlatformSchema = new Schema({
  id: { type: Number, unique: true, immutable: true },
  name: { type: String, required: true },
  logo_url: { type: String },
});

tvPlatformSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counters.findOneAndUpdate(
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
