import { model } from 'mongoose';

import fsPromises from 'fs/promises';
import path from 'path';

// export default class MovieDto {
//   constructor(model) {
//     this.title: model.title,
//     this.title_original: model.original_title,
//     this.images: {
//       poster_url: [{ ru: model.poster_path, en: { type: String } }],
//       logo_url: [{ ru: { type: String }, en: { type: String } }],
//       backdrop_url: { type: String },
//     },
//     this.release_date: ,
//     this.genres: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
//     this.countries: [{ type: Schema.Types.ObjectId, ref: 'Country' }],
//     this.director: [{ type: String }],
//     this.cast: [{ type: Schema.Types.ObjectId, ref: 'Actor' }],
//     this.watch_count: { type: Number, default: 0 },
//     this.description: {},
//     this.tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
//     this.duration: { type: Number },
//     this.production_companies: {},
//     this.ratings: {
//       wasted: { type: Number, default: 0 },
//       tmdb: { type: Number, default: 0 },
//       imdb: { type: Number, default: 0 },
//       kinopoisk: { type: Number, default: 0 },
//     },
//     this.external_ids: {
//       tmdb: { type: String },
//       imdb: { type: String },
//       kinopoisk: { type: String }
//     }
//   }
// }

export default async function createPosterUrl(
  type = 'movie',
  filename = '/Z2CbhtMtbVaBEvhqBKMNB0p0ko.jpg',
) {
  const url = 'https://image.tmdb.org/t/p/original' + filename;
  const imgRes = filename.split('.')[1];
  const newFilename = `${nanoid()}.${imgRes}`;

  try {
    await downloadImage(type, url, newFilename);
  } catch (error) {
    console.log(error.code);
  }
}

async function downloadImage(type, url, filename) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });

  const imageData = await min(response.data);
  fs.writeFile('./public/' + type + '/' + filename, imageData, async (err) => {
    if (err) throw err;
    console.log('Image downloaded successfully!');
  });
}

async function min(file) {
  const compBuf = await imagemin.buffer(file, {
    plugins: [
      imageminMozjpeg({ quality: 30 }),
      imageminPngquant({ quality: [0.3, 0.5] }),
    ],
  });
  return compBuf;
}
