import { Schema, model, mongoose } from "mongoose";
const db = mongoose.connection;
const commentTVSchema = new Schema({
    id: { type: Number, unique: true, immutable: true },
    episodeId: { type: Schema.Types.ObjectId, ref: "Episode", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parentCommentId: {
        type: Schema.Types.ObjectId,
        ref: "CommentTV",
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
}, {
    timestamps: true,
});
commentTVSchema.pre("save", async function (next) {
    if (this.isNew) {
        const counter = await db
            .collection("counters")
            .findOneAndUpdate({ _id: "commentTVid" }, { $inc: { seq: 1 } });
        this.id = counter.seq + 1;
    }
    next();
});
const CommentTV = model("CommentTV", commentTVSchema);
export default CommentTV;
//# sourceMappingURL=Comment.js.map