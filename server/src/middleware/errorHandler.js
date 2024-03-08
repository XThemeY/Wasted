import { logEvents } from './index.js';
import ApiError from '../utils/apiError.js';

export const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, 'errLog.log');
  console.error(err.stack);
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res
    .status(500)
    .json({ message: 'Непредвиденная ошибка', errors: err.errors });
};
