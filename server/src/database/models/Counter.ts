import { Schema, model } from 'mongoose';

const counterSchema = new Schema({
  _id: { type: String },
  count: { type: Number, required: true },
});

const Counter = model('Counter', counterSchema);

export default Counter;
