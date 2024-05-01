// import fs from 'fs';
// import path from 'path';
// import sharp, { Sharp } from 'sharp';
// import axios from 'axios';
// import { nanoid } from 'nanoid';
// import fsPromises from 'fs/promises';
import type { IPathImage } from '#interfaces/IFields.d.ts';

export async function createImgUrl(
  _id: number,
  _type: string,
  filename?: string,
): Promise<string> {
  if (!filename) {
    return '';
  }
  const url = process.env.TMDB_IMG_URL + filename;
  // const newFilename = `${nanoid()}_${id}.webp`;
  // await downloadImage(url, newFilename, id, type);
  // console.log(`Image + ${type}`, id);
  return url;
}

export function getImgPath(items: IPathImage[], lang: string): string {
  return (
    items.find((item: IPathImage) => item.iso_639_1 === lang)?.file_path || ''
  );
}

// async function downloadImage(
//   url: string,
//   filename: string,
//   id: number,
//   type: string,
// ): Promise<void> {
//   try {
//     const response = await axios.get(url, { responseType: 'arraybuffer' });
//     const imageData = await min(response.data);
//     if (!fs.existsSync(path.join('.', 'public', 'media', type))) {
//       await fsPromises.mkdir(path.join('.', 'public', 'media', type));
//     }
//     await fsPromises.writeFile(
//       path.join('.', 'public', 'media', type, filename),
//       imageData,
//     );
//   } catch (error) {
//     // logEvents(
//     //   `${'id:' + id + '-' + error?.name || error}: ${error?.message || error}`,
//     //   'imageReqLog.log',
//     // );
//     console.log(error?.message || error);
//   }
// }

// async function min(file: Buffer): Promise<Sharp> {
//   return sharp(file).toFormat('webp').webp({ quality: 20 });
// }
