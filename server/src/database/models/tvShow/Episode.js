import mongoose, { Schema, model } from 'mongoose';

const episodeSchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    show_id: { type: Number, required: true },
    poster_url: { type: String, default: '' },
    title: { type: String, required: true },
    title_original: { type: String, default: '' },
    episode_type: { type: String },
    season_number: { type: Number },
    episode_number: { type: Number },
    duration: { type: Number },
    air_date: { type: Date },
    watch_count: { type: Number, default: 0 },
    description: { type: String, default: '' },
    description_original: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    tags: [Number],
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
    comments: [{ type: Schema.Types.ObjectId, ref: 'CommentTV' }],
    user_ratings: [{ type: Schema.Types.ObjectId, ref: 'EpisodeRating' }],
  },
  {
    timestamps: true,
  },
);

episodeSchema.virtual('tagsId', {
  ref: 'Tag',
  localField: 'tags',
  foreignField: 'id',
});

episodeSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await mongoose.connection
      .collection('counters')
      .findOneAndUpdate({ _id: 'episodeid' }, { $inc: { seq: 1 } });
    this.id = counter.seq + 1;
  }
  next();
});

const Episode = model('Episode', episodeSchema);

export default Episode;
