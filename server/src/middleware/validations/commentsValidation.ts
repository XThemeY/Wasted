import ApiError from '#utils/apiError.js';
import mongoose from 'mongoose';
import multer from 'multer';
import { nanoid } from 'nanoid';
import mime from 'mime-types';
import { commentService } from '#services/index.js';
import { serverSettings, commentMediaTypes, ROLES } from '#config/index.js';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import __dirname from '#utils/__dirname.js';
import type { NextFunction, Request, Response } from 'express';

const Counters = mongoose.connection.collection('counters');
const urlPath = 'public/uploads/';
const uploadPath = path.join(__dirname, urlPath);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, urlPath);
  },
  filename: (req, file, cb) => {
    const ext = mime.extension(file.mimetype);
    cb(null, `${file.fieldname}--${nanoid()}.${ext}`);
  },
});

const fileFilter = async (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): Promise<void> => {
  const { type, media_id } = req.body;
  const ext = mime.extension(file.mimetype) as string;

  if (!RegExp(/(jpg|jpeg|png|gif|webp)$/).exec(ext)) {
    return cb(ApiError.BadRequest('Only images are allowed'));
  }

  if (req.method !== 'PATCH') {
    if (!commentMediaTypes.includes(type)) {
      return cb(
        ApiError.BadRequest(
          `Поле "type" должно иметь одно из значений: ${commentMediaTypes}`,
        ),
      );
    }
    const counter = await Counters.findOne({ _id: `${type}id` });
    if (media_id > counter.seq) {
      return cb(
        ApiError.BadRequest(`Объекта из "${type}" с таким id не существует.`),
      );
    }
  }

  req.fieldsIsValid = true;
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * serverSettings.maxImgFileSize },
}).array('images', 5);

export const fileUploadValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload(req, res, (err) => {
    if (err) {
      return next(ApiError.BadRequest('Не удалось загрузить файл', err));
    }
    try {
      const { files } = req;
      if (files) {
        req.files = files.map((item) => {
          const ext = mime.extension(item.mimetype) as string;
          if (!RegExp(/(gif)$/).exec(ext)) {
            const newFilePath = path.join(
              uploadPath,
              item.fieldname + '--' + nanoid() + `.${ext}`,
            );
            sharp(item.path)
              .jpeg({ quality: 40 })
              .webp({ quality: 40 })
              .png({ quality: 40 })
              .toFile(newFilePath)
              .then(() => {
                fs.unlinkSync(item.path);
              });
            item.path = newFilePath;
          }

          return item;
        });
      }
      next();
    } catch (e) {
      next(ApiError.BadRequest('Не удалось обработать файл', e));
    }
  });
};

export const isCommentOwner = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = +req.params.id;
    const currentUserName = req.user.username;
    const roles = req.user.userRoles;

    if (!currentUserName) {
      return next(ApiError.Forbidden());
    }

    if ([ROLES.ADMIN, ROLES.MODERATOR].some((role) => roles.includes(role))) {
      return next();
    }

    const isExist = await commentService.getComment(id, currentUserName);
    if (!isExist) {
      return next(ApiError.Forbidden());
    }
    next();
  } catch (e) {
    return next(e);
  }
};

export const commentsFormValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { type, media_id, comment_body } = req.body;

    if (!comment_body?.trim()) {
      return next(ApiError.BadRequest('Комментарий не должен быть пустым'));
    }

    if (req.method !== 'PATCH') {
      if (!req.fieldsIsValid) {
        if (!commentMediaTypes.includes(type)) {
          return next(
            ApiError.BadRequest(
              `Поле "type" должно иметь одно из значений: ${commentMediaTypes}`,
            ),
          );
        }
        const counter = await Counters.findOne({ _id: `${type}id` });
        if (media_id > counter.seq) {
          return next(
            ApiError.BadRequest(
              `Объекта из "${type}" с таким id не существует.`,
            ),
          );
        }
      }
    }

    next();
  } catch (e) {
    return next(ApiError.BadRequest(`Ошибка запроса.`));
  }
};
