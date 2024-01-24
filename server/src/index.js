import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { logger, errorHandler } from './middleware/index.js';
import { corsOptions } from './config/corsOptions.js';

import {
  authRouter,
  userRouter,
  movieRouter,
  tvshowRouter,
  gameRouter,
} from './routes/index.js';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/movie', movieRouter);
app.use('/show', tvshowRouter);
app.use('/game', gameRouter);
app.use('/', userRouter);
app.all('*', (req, res) => {
  res.sendStatus(404);
});
app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
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
