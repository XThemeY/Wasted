import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { logger, errorHandler } from 'Main/src/api/v1/middleware/index.js';
import { corsOptions, limiter } from 'Main/src/api/v1/config/index.js';
import v1Router from 'Main/src/api/v1/v1Router.js';
import tmdbRouter from 'Main/src/api/tmdb/routes/tmdbRouter.js';
import igdbRouter from 'Main/src/api/igdb/routes/igdbRouter.js';
import requestIp from 'request-ip';
import favicon from 'serve-favicon';
import path from 'path';
import __dirname from 'Main/src/utils/__dirname.js';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(requestIp.mw());

app.use(limiter);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(logger);
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(
  '/public/media/m',
  express.static(path.join(__dirname, 'public', 'media', 'movie')),
);
app.use(
  '/public/media/m',
  express.static(path.join(__dirname, 'public', 'media', 'show')),
);
app.use(
  '/public/media/m',
  express.static(path.join(__dirname, 'public', 'media', 'users')),
);
app.use('/tmdb', tmdbRouter);
app.use('/igdb', igdbRouter);
app.use('/v1', v1Router);

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
