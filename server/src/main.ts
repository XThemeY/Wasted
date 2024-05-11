import 'dotenv/config';
import express from 'express'; //, { Request, Response, NextFunction }
import mongoose from 'mongoose';
import {
  logger,
  errorLogger,
  invalidPathHandler,
  errorResponder,
} from '#middleware/index.js';
import { pinoHttp } from 'pino-http';
import cors from 'cors';
import v1Router from '#api/v1Router.js';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { corsOptions, logNames, limiter } from '#config/index.js';
import favicon from 'serve-favicon';
import path from 'path';
import __dirname from '#utils/__dirname.js';
import { errors } from 'celebrate';

const PORT = process.env.PORT || 8010;
const appLogger = logger(logNames.app);
const reqLogger = logger(logNames.req);
const app = express();

//Http Logger
if (process.env.NODE_ENV === 'production') {
  app.use(pinoHttp({ logger: reqLogger }));
}

//Settings
app.use(limiter);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(
  '/public/media/u',
  express.static(path.join(__dirname, 'public', 'media', 'users')),
);

// Routes
app.use('/v1', v1Router);

// Error handler
app.use(errors());
app.use('*', invalidPathHandler);
app.use(errorLogger);
app.use(errorResponder);

const start = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DB_URL_TEST);
    app.listen(PORT, () => appLogger.info(`Server started on port ${PORT}`));
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

start();
