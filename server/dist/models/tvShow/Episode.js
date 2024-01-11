import { Schema, model, mongoose } from "mongoose";
const db = mongoose.connection;
const episodeSchema = new Schema({
    id: { type: Number, unique: true, immutable: true },
    TVShowId: { type: Schema.Types.ObjectId, ref: "TVShow", required: true },
    seasonNumber: { type: Number, required: true },
    episodeNumber: { type: Number, required: true },
    title: { type: String, required: true },
    duration: { type: Number },
    releaseDate: { type: Date },
    watchCount: { type: Number, default: 0 },
    description: { type: String },
    rating: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: "CommentTV" }],
}, {
    timestamps: true,
});
episodeSchema.pre("save", async function (next) {
    if (this.isNew) {
        const counter = await db
            .collection("counters")
            .findOneAndUpdate({ _id: "episodeid" }, { $inc: { seq: 1 } });
        this.id = counter.seq + 1;
    }
    next();
});
const Episode = model("Episode", episodeSchema);
export default Episode;
//# sourceMappingURL=Episode.js.map