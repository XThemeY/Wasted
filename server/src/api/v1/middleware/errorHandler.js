import { logEvents } from '#apiV1/middleware/index.js';
import ApiError from '#utils/apiError.js';
import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, 'errLog.log');
  console.error(err.stack);
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  if (err instanceof multer.MulterError) {
    return res.status(500).json({
      message: err.message,
    });
  }
  return res
    .status(500)
    .json({ message: 'Непредвиденная ошибка', errors: err.errors });
};
