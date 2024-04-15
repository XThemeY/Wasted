import { Schema, model } from 'mongoose';
import { Counters } from '#db/models/index.js';

const countrySchema = new Schema({
  id: { type: Number, unique: true, immutable: true },
  short_name: { type: String, required: true, index: true },
  name: { type: String, required: true },
});

countrySchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counters.findOneAndUpdate(
      { _id: 'countryid' },
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true },
    );
    this.id = counter.seq;
  }
  next();
});

const Country = model('Country', countrySchema);

export default Country;
