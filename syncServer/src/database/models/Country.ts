import { Schema, model } from 'mongoose';
import { Counter } from '#db/models/index.js';

const countrySchema = new Schema({
  id: { type: Number, unique: true, immutable: true },
  short_name: { type: String, required: true, index: true },
  name: { type: String, required: true },
});

countrySchema.pre('save', async function (next) {
  if (this.isNew) {
    this.id = (
      await Counter.findOneAndUpdate(
        { _id: 'countryid' },
        { $inc: { count: 1 } },
        { returnDocument: 'after', upsert: true },
      )
    ).count;
  }
  next();
});

const Country = model('Country', countrySchema);

export default Country;
