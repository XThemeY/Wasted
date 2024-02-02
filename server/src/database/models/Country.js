import mongoose, { Schema, model } from 'mongoose';
const db = mongoose.connection;

const countrySchema = new Schema({
  id: { type: Number, unique: true, immutable: true },
  short_name: { type: String, required: true },
  name: { type: String, required: true },
});

countrySchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await db
      .collection('counters')
      .findOneAndUpdate({ _id: 'countryid' }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const Country = model('Country', countrySchema);

export default Country;
