import type { Document, Types } from 'mongoose';
import type {
  IImages,
  IRatings,
  ICommentReactions,
  IPersonJob,
  IPerson,
  IReactions,
} from './IFields.d.ts';
import type { ItemRating, UserReaction } from '#types/types.js';

interface IGeneralMediaModel extends Document {
  id: number;
  title: string;
  title_original: string;
  watch_count: number;
  description: string;
  description_original: string;
  duration: number;
  rating: number;
  ratings: IRatings;
  reactions: IReactions;
  comments: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IMediaModel extends IGeneralMediaModel {
  images: IImages;
  genres: IGenreModel[];
  countries: ICountryModel[];
  cast: IPerson[];
  tags: ITagModel[];
  production_companies: IProdCompanyModel[];
  external_ids: {
    tmdb: number;
    imdb: string;
    kinopoisk: number;
  };
  type: string;
  popularity: number;
  genresId?: IGenreModel[];
  countriesId?: ICountryModel[];
  tagsId?: ITagModel[];
  production_companiesId?: IProdCompanyModel[];
}

export interface IShowModel extends IMediaModel {
  start_date: Date;
  end_date: Date;
  status: string;
  creators: IPerson[];
  total_episodes_time: number;
  episode_duration: number;
  number_of_seasons: number;
  number_of_episodes: number;
  platforms: number[];
  platformsId?: ITVPlatformModel[];
  seasons: ISeasonModel[];
}

export interface IMovieModel extends IMediaModel {
  release_date: Date | string;
  director: IPerson[];
}

export interface ISeasonModel extends IGeneralMediaModel {
  show_id: number;
  poster_url: string;
  season_number: number;
  episode_count: number;
  air_date: Date;
  episodes: IEpisodeModel[];
}

export interface IEpisodeModel extends IGeneralMediaModel {
  show_id: number;
  poster_url: string;
  episode_type: string;
  season_number: number;
  episode_number: number;
  air_date: Date;
}

export interface IPeopleModel {
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
  id: number;
  name: string;
  logo_url: string;
}

export interface ITagModel {
  id: number;
  ru: string;
  en: string;
}

export interface IProdCompanyModel {
  id: number;
  name: string;
  logo_url: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGenreModel {
  id: number;
  ru: string;
  en: string;
}

export interface ICountryModel {
  id: number;
  short_name: string;
  name: string;
}

export interface ITokenModel {
  refreshToken: string;
  user: Types.ObjectId;
}

export interface IUserReactionsModel {
  username: string;
  movies: UserReaction[];
  tvShows: { episodes: UserReaction[] };
  games: UserReaction[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserRatingsModel {
  username: string;
  movies: ItemRating[];
  tvShows: { episodes: ItemRating[] };
  games: ItemRating[];
  createdAt?: Date;
  updatedAt?: Date;
}
