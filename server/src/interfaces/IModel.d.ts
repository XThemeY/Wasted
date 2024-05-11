import type { Document, Types } from 'mongoose';
import type { Response } from 'express';
import type {
  IImages,
  IReactions,
  IRatings,
  ICommentReactions,
  IPersonJob,
  IPerson,
} from './IFields.d.ts';

export interface IMediaModel extends Document {
  id: number;
  title: string;
  title_original: string;
  images: IImages;
  genres?: number[];
  genresId: IGenreModel[];
  countries?: number[];
  countriesId: ICountryModel[];
  cast: IPerson[];
  watch_count: number;
  description: string;
  description_original: string;
  tags?: number[];
  tagsId: ITagModel[];
  duration: number;
  production_companies?: number[];
  production_companiesId: IProdCompanyModel[];
  rating: number;
  ratings: IRatings;
  reactions: IReactions;
  comments: ICommentModel[];
  external_ids: {
    tmdb: string;
    imdb: string;
    kinopoisk: string;
  };
  type: string;
  popularity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IShowModel extends IMediaModel {
  start_date: Date;
  end_date: Date;
  status: string;
  creators: IPerson[];
  total_episodes_time: number;
  episode_duration: number;
  episodes_count: number;
  number_of_seasons: number;
  number_of_episodes: number;
  platforms?: number[];
  platformsId: ITVPlatformModel[];
  seasons: Types.ObjectId[];
}

export interface IMovieModel extends IMediaModel {
  release_date: Date;
  director: IPerson[];
}

export interface ISeasonModel extends IMediaModel {
  show_id: number;
  poster_url: string;
  season_number: number;
  episode_count: number;
  air_date: Date;
  episodes: Types.ObjectId[];
}

export interface IEpisodeModel {
  show_id: number;
  poster_url: string;
  episode_type: string;
  season_number: number;
  episode_number: number;
  air_date: Date;
}

export interface IPeopleModel {
  _id?: Types.ObjectId;
  id: number;
  original_name: string;
  translations: {
    ru: string;
    en: string;
  };
  profile_img: string;
  movies: IPersonJob[];
  shows: IPersonJob[];
  tmdb_id: number;
  comments: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
export interface ICommentModel {
  id: number;
  media_id: number;
  username: string;
  parent_comments_id: number;
  comment_body: string;
  images_url: string[];
  reactions: ICommentReactions;
  isDeleted: boolean;
  isHidden: boolean;
  isChanged: boolean;
}

export interface ITVPlatformModel {
  _id?: Types.ObjectId;
  id: number;
  name: string;
  logo_url: string;
  __v?: number;
}

export interface ITagModel {
  _id?: Types.ObjectId;
  id: number;
  ru: string;
  en: string;
  __v?: number;
}

export interface IProdCompanyModel {
  _id?: Types.ObjectId;
  id: number;
  name: string;
  logo_url: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface IGenreModel {
  _id?: Types.ObjectId;
  id: number;
  ru: string;
  en: string;
  __v?: number;
}

export interface ICountryModel {
  _id?: Types.ObjectId;
  id: number;
  short_name: string;
  name: string;
  __v?: number;
}

export interface ITokenModel {
  refreshToken: string;
  user: Types.ObjectId;
}
