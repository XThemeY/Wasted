import mongoose, { Schema, model } from 'mongoose';

const gameSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    title: { type: String, required: true },
    title_original: { type: String },
    poster_url: { type: String },
    release_date: { type: Date },
    genres: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
    platforms: [{ type: Schema.Types.ObjectId, ref: 'GamePlatform' }],
    developers: [{ type: Schema.Types.ObjectId, ref: 'Developer' }],
    publisher: [{ type: Schema.Types.ObjectId, ref: 'Publisher' }],
    playersCount: { type: Number, default: 0 },
    description: { type: String, default: '' },
    description_original: { type: String, default: '' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    duration: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    ratings: {
      wasted: {
        beer: { type: Number, default: 0 },
        favorite: { type: Number, default: 0 },
        good: { type: Number, default: 0 },
        pokerface: { type: Number, default: 0 },
        poop: { type: Number, default: 0 },
      },
      rawg: {
        rating: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      metacritic: {
        rating: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
    },
    reactions: {
      broken_heart: { type: Number, default: 0 },
      clown_face: { type: Number, default: 0 },
      dislike: { type: Number, default: 0 },
      dizzy_face: { type: Number, default: 0 },
      face_vomiting: { type: Number, default: 0 },
      fire: { type: Number, default: 0 },
      grin: { type: Number, default: 0 },
      heart_eyes: { type: Number, default: 0 },
      heart: { type: Number, default: 0 },
      joy: { type: Number, default: 0 },
      like: { type: Number, default: 0 },
      muscle: { type: Number, default: 0 },
      neutral_face: { type: Number, default: 0 },
      rude_face: { type: Number, default: 0 },
    },
    external_ids: {
      igdb: { type: String },
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'CommentGame' }],
    user_raitings: [{ type: Schema.Types.ObjectId, ref: 'GameRating' }],
    type: { type: String, enum: ['movie', 'show', 'game'], default: 'game' },
  },
  {
    timestamps: true,
  },
);

gameSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await mongoose.connection
      .collection('counters')
      .findOneAndUpdate({ _id: 'gameid' }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const Game = model('Game', gameSchema);

export default Game;
