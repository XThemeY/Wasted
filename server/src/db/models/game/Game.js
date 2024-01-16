import mongoose, { Schema, model } from 'mongoose';
const db = mongoose.connection;

const gameSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    title: { type: String, required: true },
    posterUrl: { type: String, required: true },
    releaseDate: { type: Date },
    genres: [{ type: String }],
    platforms: [{ type: String }],
    developer: [{ type: String }],
    playersCount: { type: Number, default: 0 },
    description: { type: String },
    tags: [{ type: String }],
    duration: { type: Number },
    ratings: {
      wasted: { type: Number, default: 0 },
      rawg: { type: Number, default: 0 },
      metacritic: { type: Number, default: 0 },
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'CommentGame' }],
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
  },
);

gameSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await db
      .collection('counters')
      .findOneAndUpdate({ _id: 'gameid' }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const Game = model('Game', gameSchema);

export default Game;
