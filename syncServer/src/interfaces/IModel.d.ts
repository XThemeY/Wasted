import { Document, Types } from 'mongoose';
import {
  ICountry,
  ICredits,
  IGenre,
  IImages,
  IPeople,
  IProdCompany,
  ITag,
} from './IFields';

export interface IMediaModel {
  title: string;
  original_title: string;
  release_date: Date;
  overview: string;
  runtime: string;
  duration: number;
  vote_average: number;
  vote_count: number;
  images: IImages;
  poster_path?: string;
  backdrop_path?: string;
  //imdb: { type: Number, default: 0 },
  //kinopoisk: { type: Number, default: 0 },
  id: number;
  imdb_id: number;
  genres: IGenre[];
  keywords: { keywords: ITag[] };
  credits: ICredits;
  production_companies: IProdCompany[];
  production_countries: ICountry[];
  popularity: number;
}

export interface IMovie extends Document {
  title: string;
  title_original: string;
  images: IImages;
  release_date: Date;
  genres: IGenre[];
  countries: ICountry[];
  director: IPeople[];
  cast: IPeople[];
  watch_count: number;
  description: string;
  description_original: string;
  tags: ITag[];
  duration: number;
  production_companies: IProdCompany[];
  rating: number;
  ratings: {
    wasted: {
      beer: number;
      favorite: number;
      good: number;
      pokerface: number;
      poop: number;
      vote_count: number;
    };
    tmdb: {
      rating: number;
      vote_count: number;
    };
    imdb: {
      rating: number;
      vote_count: number;
    };
    kinopoisk: {
      rating: number;
      vote_count: number;
    };
  };
  reactions: {
    shocked: {
      value: number;
      vote_count: number;
    };
    thrilled: {
      value: number;
      vote_count: number;
    };
    scared: {
      value: number;
      vote_count: number;
    };
    sad: {
      value: number;
      vote_count: number;
    };
    touched: {
      value: number;
      vote_count: number;
    };
    bored: {
      value: number;
      vote_count: number;
    };
    confused: {
      value: number;
      vote_count: number;
    };
    amused: {
      value: number;
      vote_count: number;
    };
    tense: {
      value: number;
      vote_count: number;
    };
    reflective: {
      value: number;
      vote_count: number;
    };
  };
  comments: Types.ObjectId;
  external_ids: {
    tmdb: string;
    imdb: string;
    kinopoisk: string;
  };
  type: string;
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
}
