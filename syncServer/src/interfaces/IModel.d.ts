import { Document, Types } from 'mongoose';
import {
  ICountry,
  ICredits,
  IGenre,
  IImages,
  IPeople,
  IPlatform,
  IProdCompany,
  ISeason,
  ITag,
} from './IFields';

export interface IMediaModel extends Document {
  title: string;
  original_title: string;
  //imdb: { type: Number, default: 0 },
  //kinopoisk: { type: Number, default: 0 },
  imdb_id: number;
  name: string;
  original_name: string;
  release_date: Date;
  first_air_date: Date;
  last_air_date: Date;
  status: string;
  episode_run_time: number;
  number_of_seasons: number;
  number_of_episodes: number;
  overview: string;
  runtime: string;
  duration: number;
  vote_average: number;
  vote_count: number;
  images: IImages;
  poster_path?: string;
  backdrop_path?: string;
  id: number;
  external_ids: {
    imdb_id: number;
    tmdb: number;
  };
  created_by: IPeople[];
  genres: IGenre[];
  keywords: { results: ITag[] };
  credits: ICredits;
  seasons: ISeason[] | Types.ObjectId[];
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
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShow extends IMediaModel {
  title_original: string;
  countries: ICountry[];
  director: IPeople[];
  cast: IPeople[];
  watch_count: number;
  description: string;
  description_original: string;
  tags: ITag[];
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
  creators: IPeople[];
  comments: Types.ObjectId;
  type: string;
  platforms: IPlatform[];
  createdAt: Date;
  updatedAt: Date;
}
