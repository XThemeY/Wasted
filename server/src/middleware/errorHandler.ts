import { NextFunction, Request, Response } from 'express';
import { logger } from '#middleware/index.js';
import ApiError from '#utils/apiError.js';
import { logNames } from '#config/index.js';

const errLogger = logger(logNames.err);

export const errorLogger = (
  err: Error | ApiError,
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  errLogger.error(err, err.stack, err.message);
  return next(err);
};

export const invalidPathHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  return res.status(404).send('Invalid path: ' + req.originalUrl);
};

export const errorResponder = (
  err: ApiError | Error,
  _req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res
    .status(500)
    .json({ message: `Непредвиденная ошибка: ${err.message}` });
};
