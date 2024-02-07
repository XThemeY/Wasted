import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import fsPromises from 'fs/promises';
import { nanoid } from 'nanoid';
import axios from 'axios';
import logEvents from '../middleware/logEvents.js';
import sharp from 'sharp';

export async function createImgUrl(id, type, filename) {
  if (!filename) {
    return '';
  }
  const url = process.env.TMDB_IMG_URL + filename;
  const newFilename = `${nanoid()}_${id}.webp`;
  await downloadImage(url, newFilename, id, type);
  return '/' + newFilename;
}

export function getImgPath(items, lang) {
  return items.find((item) => item.iso_639_1 === lang)?.file_path || '';
}

async function downloadImage(url, filename, id, type) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageData = await min(response.data);
    if (!fs.existsSync(path.join('.', 'public', 'media', type))) {
      await fsPromises.mkdir(path.join('.', 'public', 'media', type));
    }
    await fsPromises.writeFile(
      path.join('.', 'public', 'media', type, filename),
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
  return sharp(file).toFormat('webp').webp({ quality: 20 });
}
