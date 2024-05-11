import type { SortOrder } from 'mongoose';
import type {
  ICountry,
  IExternalIds,
  IGenre,
  IImages,
  IPerson,
  IProdCompany,
  ITag,
} from './IFields';

export interface IMovieUpdate {
  title: string;
  title_original: string;
  images: IImages;
  release_date: Date;
  genres: IGenre[];
  countries: ICountry[];
  tags: ITag[];
  description: string;
  description_original: string;
  duration: number;
  production_companies: IProdCompany[];
  external_ids: IExternalIds;
  type: string;
}

export interface IMovieSearchResult {
  items: IMovie[];
  page: number;
  total_pages: number;
  total_items: number;
}

export interface ISearchQuery {
  page: number;
  limit: number;
  sort_by: [string, SortOrder];
  title: string;
  start_year: Date | number;
  end_year: Date | number;
  genres: number[];
  countries: number[];
  wastedIds: number[];
}

export interface IErrMsg {
  message: string;
}

export interface IMediaSearchResult {
  id: number;
  title: string;
  title_original: string;
  images: IImages;
  genres: IGenre[];
  countries: ICountry[];
  description: string;
  description_original: string;
  duration: number;
  rating: number;
  type: string;
  watch_count: number;
  popularity: number;
}
