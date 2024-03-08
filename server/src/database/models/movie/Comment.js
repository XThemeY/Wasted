import mongoose, { Schema, model } from 'mongoose';

const commentMovieSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    movie_id: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parent_comment_id: {
      type: Schema.Types.ObjectId,
      ref: 'CommentMovie',
      default: 0,
    },
    text: { type: String, required: true },
    image_url: [{ type: String }],
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
  },
  {
    timestamps: true,
  },
);

commentMovieSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await mongoose.connection
      .collection('counters')
      .findOneAndUpdate({ _id: 'commentMovieid' }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const CommentMovie = model('CommentMovie', commentMovieSchema);

export default CommentMovie;
