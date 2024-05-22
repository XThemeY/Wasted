import { Document, Types } from 'mongoose';
import type {
  ICountry,
  ICredits,
  IGenre,
  IImages,
  IPeople,
  IPlatform,
  IProdCompany,
  ISeason,
  ITag,
} from './IFields.d.ts';

export interface IMediaModel extends Document {
  title: string;
  original_title: string;
  imdb_id: number;
  name: string;
  original_name: string;
  release_date: Date;
  first_air_date: Date;
  last_air_date: Date;
  status: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  images: IImages;
  poster_path?: string;
  backdrop_path?: string;

  id: number;
  external_ids: {
    imdb: string;
    tmdb: number;
    kinopoisk: number;
  };
  created_by: IPeople[];
  genres: IGenre[];
  keywords: {
    keywords: ITag[];
    results: ITag[];
  };
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
  credits: ICredits;
  seasons: ISeason[];
  networks: IPlatform[];
  production_companies: IProdCompany[];
  production_countries: ICountry[];
  popularity: number;
}

export interface IMovie extends IMediaModel {
  title_original: string;
  countries: ICountry[];
  director: IPeople[];
  cast: IPeople[];
  watch_count: number;
  description: string;
  description_original: string;
  tags: ITag[];
  comments: Types.ObjectId;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  runtime: number;
}

export interface IShow extends IMediaModel {
  title_original: string;
  countries: ICountry[];
  director: IPeople[];
  cast: IPeople[];
  start_date: Date;
  end_date: Date;
  total_episodes_time: number;
  episode_duration: number;
  number_of_seasons: number;
  number_of_episodes: number;
  watch_count: number;
  description: string;
  description_original: string;
  tags: ITag[];
  creators: IPeople[];
  comments: Types.ObjectId;
  type: string;
  platforms: IPlatform[];
  createdAt: Date;
  updatedAt: Date;
}
