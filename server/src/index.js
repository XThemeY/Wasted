import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { logger, errorHandler } from '#apiV1/middleware/index.js';
import { corsOptions } from '#apiV1/config/index.js';
import v1Router from '#apiV1/v1Router.js';
import tmdbRouter from '#api/tmdb/routes/tmdbRouter.js';
import igdbRouter from '#api/igdb/routes/igdbRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV === 'development') {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
}

app.use(logger);

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(
  '/public/media/m',
  express.static(path.resolve(__dirname, '..', 'public', 'media', 'movie')),
);
app.use(
  '/public/media/m',
  express.static(path.resolve(__dirname, '..', 'public', 'media', 'show')),
);
app.use(
  '/public/media/m',
  express.static(path.resolve(__dirname, '..', 'public', 'media', 'users')),
);
app.use('/tmdb', tmdbRouter);
app.use('/igdb', igdbRouter);
app.use('/api/v1', v1Router);

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
