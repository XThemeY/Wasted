import type { ITVPlatformModel } from '#interfaces/IModel';
import { Schema, model } from 'mongoose';

const tvPlatformSchema = new Schema({
  id: { type: Number, unique: true, immutable: true },
  name: { type: String, required: true },
  logo_url: { type: String },
});

const TVPlatform = model<ITVPlatformModel>('TVPlatform', tvPlatformSchema);

export default TVPlatform;
