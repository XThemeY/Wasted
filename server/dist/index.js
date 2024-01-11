import "dotenv/config.js";
import express from "express";
import mongoose from "mongoose";
//import Movie from "./models/movie/Movie.js";
import { authRouter, userRouter, movieRouter, tvshowRouter, gameRouter, } from "./routes/index.js";
import cors from "cors";
// import DBfill, { fillEpisodesDB } from "./DataBase/dbFill.js";
// const dbfill = new DBfill();
// dbfill.fillMovieDB();
// dbfill.filltvShowDB();
// dbfill.fillGameDB();
// fillEpisodesDB();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/movie", movieRouter);
app.use("/tvshow", tvshowRouter);
app.use("/game", gameRouter);
app.use("", userRouter);
const start = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/WastedDB");
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    }
    catch (e) {
        console.log(e);
    }
};
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});
start();
//# sourceMappingURL=index.js.map