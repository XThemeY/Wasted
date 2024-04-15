import ApiError from 'Main/src/utils/apiError.js';
import mongoose from 'mongoose';
import multer from 'multer';
import { nanoid } from 'nanoid';
import mime from 'mime-types';
import { commentService } from 'Main/src/api/v1/services/index.js';
import {
  serverSettings,
  commentMediaTypes,
  ROLES,
} from 'Main/src/api/v1/config/index.js';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import __dirname from 'Main/src/utils/__dirname.js';

const Counters = mongoose.connection.collection('counters');
const urlPath = 'public/uploads/';
const uploadPath = path.join(__dirname, urlPath);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, urlPath);
  },
  filename: function (req, file, cb) {
    const ext = mime.extension(file.mimetype);
    cb(null, `${file.fieldname}--${nanoid()}.${ext}`);
  },
});

const fileFilter = async (req, file, cb) => {
  const { type, media_id } = req.body;
  const ext = mime.extension(file.mimetype);
  if (req.method === 'PATCH') {
    if (!ext.match(/(jpg|jpeg|png|gif|webp)$/)) {
      return cb(ApiError.BadRequest('Only images are allowed'), false);
    }
    req.fieldsIsValid = true;
    return cb(null, true);
  }
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
  if (!ext.match(/(jpg|jpeg|png|gif|webp)$/)) {
    return cb(ApiError.BadRequest('Only images are allowed'), false);
  }
  req.fieldsIsValid = true;
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * serverSettings.maxImgFileSize },
}).array('images', 5);

export const fileUploadValidation = async (req, res, next) => {
  upload(req, res, (err) => {
    try {
      const { files } = req;
      req.files = files?.map((item) => {
        const ext = mime.extension(item.mimetype);
        if (ext.match(/(gif)$/)) {
          return item;
        }
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
        return item;
      });
      next();
    } catch (e) {
      return next(ApiError.BadRequest('Не удалось загрузить файл', e));
    }
  });
};

export const isCommentOwner = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const currentUserName = req.user.username;
    const roles = req.user.userRoles;

    if (!currentUserName) {
      return next(ApiError.Forbidden());
    }

    if (roles.includes([ROLES.ADMIN, ROLES.MODERATOR])) {
      return next();
    }
    await commentService.getComment(commentId, currentUserName);
    next();
  } catch (e) {
    return next(ApiError.Forbidden());
  }
};

export const commentsFormValidation = async (req, res, next) => {
  try {
    const { type, media_id, comment_body } = req.body;
    const isCommentEmpty = comment_body?.trim() !== '';
    if (req.method === 'PATCH') {
      return !isCommentEmpty
        ? next(ApiError.BadRequest('Комментарий не должен быть пустым'))
        : next();
    }

    if (!req.fieldsIsValid) {
      if (!isCommentEmpty) {
        return next(ApiError.BadRequest('Комментарий не должен быть пустым'));
      }
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
          ApiError.BadRequest(`Объекта из "${type}" с таким id не существует.`),
        );
      }
    }
    next();
  } catch (e) {
    return next(ApiError.BadRequest(`Ошибка запроса.`));
  }
};
