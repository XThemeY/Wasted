import { Schema, model } from 'mongoose';

const commentsMediaSchema = new Schema({
  media_id: { type: Number, unique: true, immutable: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }],
});

const CommentsMovie = model('CommentsMovie', commentsMediaSchema);
const CommentsShow = model('CommentsShow', commentsMediaSchema);
const CommentsSeason = model('CommentsSeason', commentsMediaSchema);
const CommentsEpisode = model('CommentsEpisode', commentsMediaSchema);
const CommentsPeople = model('CommentsPeople', commentsMediaSchema);

export {
  CommentsMovie,
  CommentsShow,
  CommentsSeason,
  CommentsEpisode,
  CommentsPeople,
};
