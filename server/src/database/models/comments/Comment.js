import mongoose, { Schema, model } from 'mongoose';

const commentSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    username: { type: String, required: true },
    parent_comments_id: { type: Number, default: null },
    comment_body: { type: String, required: true },
    images_url: [{ type: String }],
    reactions: {
      broken_heart: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      clown_face: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      dislike: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      dizzy_face: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      face_vomiting: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      fire: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      grin: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      heart_eyes: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      heart: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      joy: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      like: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      muscle: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      neutral_face: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
      rude_face: {
        value: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 },
      },
    },
    isDeleted: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

commentSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await mongoose.connection
      .collection('counters')
      .findOneAndUpdate(
        { _id: 'commentId' },
        { $inc: { seq: 1 } },
        { returnDocument: 'after', upsert: true },
      );
    this.id = counter.seq;
  }
  next();
});

const Comment = model('Comment', commentSchema);

export default Comment;
