import type { IMediaSearchResult } from '#interfaces/IApp';
import type { IImages, IGenre, ICountry, IPerson } from '#interfaces/IFields';
import type { IShowModel } from '#interfaces/IModel';
import { formatISO } from 'date-fns';
import { getPeoples } from './movieDto';

export class ShowShort implements IMediaSearchResult {
  id: number;
  title: string;
  title_original: string;
  images: IImages;
  genres: IGenre[];
  countries: ICountry[];
  creators: IPerson[];
  description: string;
  description_original: string;
  duration: number;
  rating: number;
  type: string;
  watch_count: number;
  popularity: number;
  start_date: string;
  constructor(model: IShowModel) {
    this.id = model.id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.images = model.images;
    this.start_date = formatISO(new Date(model.start_date), {
      representation: 'date',
    });
    this.creators = getPeoples(model.creators);
    this.description = model.description;
    this.description_original = model.description_original;
    this.duration = model.duration;
    this.rating = model.rating;
  }
}
