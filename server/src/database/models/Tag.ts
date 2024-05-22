import type { ITagModel } from '#interfaces/IModel';
import { Schema, model } from 'mongoose';

const tagSchema = new Schema({
  id: { type: Number, unique: true, immutable: true },
  ru: { type: String, required: true },
  en: { type: String, required: true },
});

const Tag = model<ITagModel>('Tag', tagSchema);

export default Tag;
