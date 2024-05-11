import type { ITVPlatformModel } from '#interfaces/IModel';
import { Schema, model } from 'mongoose';

const tvPlatformSchema = new Schema({
  id: { type: Number, unique: true, immutable: true },
  name: { type: String, required: true },
  logo_url: { type: String },
});

tvPlatformSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.id = (await TVPlatform.countDocuments()) + 1;
  }
  next();
});

const TVPlatform = model<ITVPlatformModel>('TVPlatform', tvPlatformSchema);

export default TVPlatform;
