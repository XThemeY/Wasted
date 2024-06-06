import { uploadService } from '#services/index.js';
import ApiError from '#utils/apiError.js';

import type { Request, Response, NextFunction } from 'express';

class UploadController {
  async uploadFile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void> | void> {
    try {
      const { type } = req.body;
      const file = req.files.file;
      if (!file) {
        return next(ApiError.BadRequest('Файл не загружен'));
      }
      const response = await uploadService.uploadFile(file, type);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default new UploadController();
