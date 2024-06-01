import { Schema, model } from 'mongoose';
import { Counter } from '#db/models/index.js';
import type { ICommentModel } from '#interfaces/IModel';

const commentSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    username: { type: String, required: true },
    parent_comments_id: { type: Number },
    comment_body: { type: String, default: '' },
    images_url: [{ type: String }],
    reactions: {
      broken_heart: {
        vote_count: { type: Number, default: 0 },
      },
      clown_face: {
        vote_count: { type: Number, default: 0 },
      },
      dislike: {
        vote_count: { type: Number, default: 0 },
      },
      dizzy_face: {
        vote_count: { type: Number, default: 0 },
      },
      face_vomiting: {
        vote_count: { type: Number, default: 0 },
      },
      fire: {
        vote_count: { type: Number, default: 0 },
      },
      grin: {
        vote_count: { type: Number, default: 0 },
      },
      heart_eyes: {
        vote_count: { type: Number, default: 0 },
      },
      heart: {
        vote_count: { type: Number, default: 0 },
      },
      joy: {
        vote_count: { type: Number, default: 0 },
      },
      like: {
        vote_count: { type: Number, default: 0 },
      },
      muscle: {
        vote_count: { type: Number, default: 0 },
      },
      neutral_face: {
        vote_count: { type: Number, default: 0 },
      },
      rude_face: {
        vote_count: { type: Number, default: 0 },
      },
    },
    isDeleted: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
    isChanged: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

commentSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.id = (
      await Counter.findOneAndUpdate(
        { _id: 'commentid' },
        { $inc: { count: 1 } },
        { returnDocument: 'after', upsert: true },
      )
    ).count;
  }
  next();
});

const Comment = model<ICommentModel>('Comment', commentSchema);

export default Comment;
