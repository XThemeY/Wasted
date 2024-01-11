import mongoose, { Schema, model } from 'mongoose';
const db = mongoose.connection;

const commentGameSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: 'CommentGame',
      default: 0,
    },
    text: { type: String, required: true },
    imageUrl: [{ type: String }],
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
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
  },
);

commentGameSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await db
      .collection('counters')
      .findOneAndUpdate({ _id: 'commentGameid' }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const CommentGame = model('CommentGame', commentGameSchema);

export default CommentGame;
