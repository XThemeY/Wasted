import { Schema, model } from 'mongoose';
import { Counter } from '#db/models/index.js';

const tvPlatformSchema = new Schema({
  id: { type: Number, unique: true, immutable: true },
  name: { type: String, required: true },
  logo_url: { type: String },
});

tvPlatformSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.id = (
      await Counter.findOneAndUpdate(
        { _id: 'tvplatformid' },
        { $inc: { count: 1 } },
        { returnDocument: 'after', upsert: true },
      )
    ).count;
  }
  next();
});

const TVPlatform = model('TVPlatform', tvPlatformSchema);

export default TVPlatform;
