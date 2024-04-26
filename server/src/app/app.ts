import express from 'express';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { logger } from '#/middleware/index.js';
import { pinoHttp } from 'pino-http';
import { corsOptions } from '#/config/index.js';
import { errorLogger } from '#/middleware/errorHandler.js';

const app = express();

//Logger
app.use(
  pinoHttp({
    logger,
  }),
);

//Settings
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Routes
// app.use('/tmdb', tmdbRouter);

// Error handler
// app.use(errorLogger);
// app.use(invalidPathHandler);

// app.use((err, req, res, next) => {
//   errorLogger(err, req, res, next);
// });

export default app;
