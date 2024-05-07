import { Schema, model } from 'mongoose';

const countrySchema = new Schema({
  id: { type: Number, unique: true, immutable: true },
  short_name: { type: String, required: true, index: true },
  name: { type: String, required: true },
});

countrySchema.pre('save', async function (next) {
  if (this.isNew) {
    this.id = (await Country.countDocuments()) + 1;
  }
  next();
});

const Country = model('Country', countrySchema);

export default Country;
