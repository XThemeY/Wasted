import ApiError from '#utils/apiError.js';
import mongoose from 'mongoose';
import multer from 'multer';
import { nanoid } from 'nanoid';
import mime from 'mime-types';
import { serverSettings, commentMediaTypes } from '#apiV1/config/index.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const ext = mime.extension(file.mimetype);
    cb(null, `${file.fieldname}-${nanoid()}.${ext}`);
  },
});

const fileFilter = async (req, file, cb) => {
  const type = req.body.type;
  if (!req.body.comment_body.trim()) {
    return cb(ApiError.BadRequest('Комментарий не должен быть пустым'));
  }
  if (!commentMediaTypes.includes(type)) {
    return cb(
      ApiError.BadRequest(
        `Поле "type" должно иметь одно из значений: ${commentMediaTypes}`,
      ),
    );
  }
  const counter = await mongoose.connection
    .collection('counters')
    .findOne({ _id: `${type}id` });
  if (req.body.media_id > counter.seq) {
    return cb(
      ApiError.BadRequest(`Объекта из "${type}" с таким id не существует.`),
    );
  }
  const ext = mime.extension(file.mimetype);
  if (!ext.match(/(jpg|jpeg|png|gif|webp)$/)) {
    return cb(ApiError.BadRequest('Only images are allowed'), false);
  }
  req.fieldsIsValid = true;
  cb(null, true);
};

export const commentsUploadValidation = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * serverSettings.maxImgFileSize },
}).array('images', 5);
