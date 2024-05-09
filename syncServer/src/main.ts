import 'dotenv/config';
import express from 'express'; //, { Request, Response, NextFunction }
import mongoose from 'mongoose';

import {
  logger,
  errorLogger,
  invalidPathHandler,
  errorResponder,
} from '#middleware/index.js';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { corsOptions, logNames } from '#config/index.js';
import tmdbRouter from '#api/tmdb/v1/tmdbRouter.js';

const PORT = process.env.PORT || 8010;
const appLogger = logger(logNames.app);
const app = express();

//Settings
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Routes
app.use('/tmdb', tmdbRouter);

// Error handler
app.use('*', invalidPathHandler);
app.use(errorLogger);
app.use(errorResponder);

const start = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DB_URL_TMDBMain);
    app.listen(PORT, () =>
      appLogger.info(`Sync server started on port ${PORT}`),
    );
  } catch (e) {
    appLogger.error(e);
  }
};

const db = mongoose.connection;
db.on(
  'error',
  appLogger.error.bind(appLogger.error, 'MongoDB connection error:'),
);
db.once('open', () => {
  appLogger.info('Connected to MongoDB');
});
export default app;
start();
