import 'dotenv/config';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { nanoid } from 'nanoid';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import axios from 'axios';
import logEvents from '../middleware/logEvents.js';

export async function createImgUrl(id, type, filename) {
  if (!filename) {
    return '';
  }
  const url = process.env.TMDB_IMG_URL + filename;
  const imgRes = filename.split('.')[1];
  const newFilename = `${nanoid()}.${imgRes}`;
  await downloadImage(url, newFilename, id, type);
  console.log('Image: ', id);
  return '/' + newFilename;
}

export function getImgPath(items, lang) {
  return items.find((item) => item.iso_639_1 === lang)?.file_path || '';
}

async function downloadImage(url, filename, id, type) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageData = await min(response.data);
    if (type === 'people' || type === 'company' || type === 'platform') {
      if (!fs.existsSync('./public/media/' + type + '/')) {
        await fsPromises.mkdir('./public/media/' + type + '/');
      }
      await fsPromises.writeFile(
        './public/media/' + type + '/' + filename,
        imageData,
      );
      return;
    }

    if (!fs.existsSync('./public/media/' + type + '/' + id)) {
      await fsPromises.mkdir('./public/media/' + type + '/' + id + '/');
    }
    await fsPromises.writeFile(
      './public/media/' + type + '/' + id + '/' + filename,
      imageData,
    );
  } catch (error) {
    logEvents(
      `${'id:' + id + '-' + error?.name || error}: ${error?.message || error}`,
      'imageReqLog.log',
    );
    console.log(error?.message || error);
  }
}

async function min(file) {
  const compBuf = await imagemin.buffer(file, {
    plugins: [
      imageminMozjpeg({ quality: 40 }),
      imageminPngquant({ quality: [0.4, 0.5] }),
    ],
  });
  return compBuf;
}
