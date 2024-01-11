import { Schema, model } from "mongoose";
const gameRatingSchema = new Schema({
    targetId: { type: Number, required: true },
    ratingValue: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
}, {
    timestamps: true,
});
const GameRating = model("GameRating", gameRatingSchema);
export default GameRating;
//# sourceMappingURL=Raiting.js.map