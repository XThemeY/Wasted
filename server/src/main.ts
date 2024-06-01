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
import { Role } from '#database/models';

const PORT = process.env.PORT || 8010;
const appLogger = logger(logNames.app);
const reqLogger = logger(logNames.req);
const app = express();

// Middleware
app.use(limiter);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Static files
app.use(
  '/public/media/u',
  express.static(path.join(__dirname, 'public', 'media', 'users')),
);

// HTTP Logger (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(pinoHttp({ logger: reqLogger }));
}

// Routes
app.use('/v1', v1Router);

// Error handling
app.use(errors());
app.use('*', invalidPathHandler);
app.use(errorLogger);
app.use(errorResponder);

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.NODE_ENV === 'production'
        ? process.env.DB_URL_TMDBMains
        : process.env.DB_URL_REPLICA_LOCAL,
      { replicaSet: 'dbrs' },
    );
    appLogger.info('Connected to MongoDB');
  } catch (error) {
    appLogger.error(`MongoDB connection error: ${error?.message}`);
  }
};

const createRoles = async (): Promise<void> => {
  try {
    await Role.findOneAndUpdate(
      { role: 'User' },
      { role: 'User' },
      { upsert: true },
    );
    await Role.findOneAndUpdate(
      { role: 'Admin' },
      { role: 'Admin' },
      { upsert: true },
    );
  } catch (error) {
    appLogger.error(`Roles creating failed with error: ${error?.message}`);
  }
};

app.listen(PORT, async () => {
  appLogger.info(`Server started on port ${PORT}`);
  await connectDB();
  await createRoles();
});
