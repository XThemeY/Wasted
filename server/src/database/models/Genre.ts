import type { IGenreModel } from '#interfaces/IModel';
import { Schema, model } from 'mongoose';

const genreSchema = new Schema({
  id: { type: Number, unique: true, immutable: true },
  ru: { type: String, required: true },
  en: { type: String, required: true },
});

genreSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.id = (await Genre.countDocuments()) + 1;
  }
  next();
});

const Genre = model<IGenreModel>('Genre', genreSchema);

export default Genre;
