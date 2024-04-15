import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { logger, errorHandler } from '#apiV1/middleware/index.js';
import { corsOptions } from '#apiV1/config/index.js';
import tmdbRouter from '#api/tmdb/routes/tmdbRouter.js';
import igdbRouter from '#api/igdb/routes/igdbRouter.js';

const app = express();
const PORT = process.env.PORT || 5050;

app.use(logger);

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(express.json());
app.use(cookieParser());

app.use('/tmdb', tmdbRouter);
app.use('/igdb', igdbRouter);

app.all('*', (req, res) => {
  res.sendStatus(404);
});
app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL_TMDBMain);
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

start();
