import type { ICountryModel } from '#interfaces/IModel';
import { Schema, model } from 'mongoose';

const countrySchema = new Schema({
  id: { type: Number, unique: true, immutable: true },
  short_name: { type: String, required: true, index: true },
  name: { type: String, required: true },
});

const Country = model<ICountryModel>('Country', countrySchema);

export default Country;
