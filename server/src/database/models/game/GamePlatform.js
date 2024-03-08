import mongoose, { Schema, model } from 'mongoose';

const gamePlatformSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

gamePlatformSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await mongoose.connection
      .collection('counters')
      .findOneAndUpdate({ _id: 'gameplatformid' }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const GamePlatform = model('GamePlatform', gamePlatformSchema);

export default GamePlatform;
