import type { ICommentsMediaModel } from '#interfaces/IModel';
import { Schema, model } from 'mongoose';

const commentsMediaSchema = new Schema({
  media_id: { type: Number, unique: true, immutable: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }],
});

const CommentsMovie = model<ICommentsMediaModel>(
  'CommentsMovie',
  commentsMediaSchema,
);
const CommentsShow = model<ICommentsMediaModel>(
  'CommentsShow',
  commentsMediaSchema,
);
const CommentsSeason = model<ICommentsMediaModel>(
  'CommentsSeason',
  commentsMediaSchema,
);
const CommentsEpisode = model<ICommentsMediaModel>(
  'CommentsEpisode',
  commentsMediaSchema,
);
const CommentsPeople = model<ICommentsMediaModel>(
  'CommentsPeople',
  commentsMediaSchema,
);

export {
  CommentsMovie,
  CommentsShow,
  CommentsSeason,
  CommentsEpisode,
  CommentsPeople,
};
