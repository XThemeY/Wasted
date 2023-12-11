require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const movieRouter = require("./routes/movieRouter");
const gameRouter = require("./routes/gameRouter");
const tvshowRouter = require("./routes/tvshowRouter");
const PORT = process.env.PORT || 3000;

// const addItemToDB = require("./kinopoisk");
// addItemToDB();

// const addGameToDB = require("./rawg");
// addGameToDB();

const app = express();

app.use(express.json());
app.use("/auth", authRouter);
app.use("/movie", movieRouter);
app.use("/game", gameRouter);
app.use("/tv-show", tvshowRouter);

const start = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/WastedDB");
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

start();
