import type { IGenreModel } from '#interfaces/IModel';
import { Schema, model } from 'mongoose';

const genreSchema = new Schema({
  id: { type: Number, unique: true, immutable: true },
  ru: { type: String, required: true },
  en: { type: String, required: true },
});

const Genre = model<IGenreModel>('Genre', genreSchema);

export default Genre;
