import { Schema, model } from 'mongoose';
import { Counters } from '#db/models/index.js';

const tagSchema = new Schema({
  id: { type: Number, unique: true, immutable: true },
  ru: { type: String, required: true },
  en: { type: String, required: true },
});

tagSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counters.findOneAndUpdate(
      { _id: 'tagid' },
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true },
    );
    this.id = counter.seq;
  }
  next();
});

const Tag = model('Tag', tagSchema);

export default Tag;
