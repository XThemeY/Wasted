import { Schema, model } from 'mongoose';

const countersSchema = new Schema({
  _id: { type: String, unique: true, immutable: true },
  seq: { type: Number, required: true },
});

const Counters = model('Counters', countersSchema);

export default Counters;
