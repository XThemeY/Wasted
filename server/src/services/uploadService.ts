import { nanoid } from 'nanoid';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

class UploadService {
  async uploadFile(file: Express.Multer.File, type: string): Promise<void> {
    const newFilePath = path.join(
      __dirname,
      'public',
      'uploads',
      type,
      file.fieldname + '--' + nanoid() + `.${file.mimetype}`,
    );
    await sharp(file.path)
      .jpeg({ quality: 40 })
      .webp({ quality: 40 })
      .png({ quality: 40 })
      .toFile(newFilePath)
      .then(() => {
        fs.unlinkSync(file.path);
      });
    file.path = newFilePath;
  }
}

export default new UploadService();
