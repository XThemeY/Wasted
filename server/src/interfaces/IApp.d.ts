import type { SortOrder, Types } from 'mongoose';
import type {
  IExternalIds,
  IImages,
  IPerson,
  IRatings,
  IReactions,
} from './IFields';
import type {
  IGenreModel,
  ICountryModel,
  ITagModel,
  IProdCompanyModel,
  ITVPlatformModel,
} from './IModel';

interface IMediaUpdate {
  title: string;
  title_original: string;
  images: IImages;
  genres: IGenreModel[];
  countries: ICountryModel[];
  tags: ITagModel[];
  description: string;
  description_original: string;
  production_companies: IProdCompanyModel[];
  external_ids: IExternalIds;
}
export interface IMovieUpdate extends IMediaUpdate {
  release_date: Date;
  type: string;
  duration: number;
}

export interface IShowUpdate extends IMediaUpdate {
  start_date: Date;
  end_date: Date;
  status: string;
  type: string;
}

export interface ISeasonUpdate extends IMediaUpdate {
  poster_url: string;
  season_number: number;
  episode_count: number;
  air_date: Date;
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
  tvPlatforms?: number[];
}

export interface IErrMsg {
  message: string;
}

interface IMediaSearchResult {
  id: number;
  title: string;
  title_original: string;
  images: IImages;
  genres: IGenreModel[];
  countries: ICountryModel[];
  description: string;
  description_original: string;
  duration: number;
  rating: number;
  type: string;
  watch_count: number;
  popularity: number;
}

export interface IMovieSearchResult extends IMediaSearchResult {
  release_date: string;
  director: IPerson[];
}

export interface IShowSearchResult extends IMediaSearchResult {
  start_date: Date;
  end_date: Date;
  status: string;
  creators: IPerson[];
  total_episodes_time: number;
  episode_duration: number;
  episodes_count: number;
  number_of_seasons: number;
  number_of_episodes: number;
  platforms: ITVPlatformModel[];
}

export interface ISearchResult {
  items: IMovieSearchResult[] | IShowSearchResult[];
  page: number;
  total_pages: number;
  total_items: number;
}

interface IGeneralMedia {
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

interface IMedia extends IGeneralMedia {
  images: IImages;
  genres: IGenreModel[];
  countries: ICountryModel[];
  cast: IPerson[];
  tags: ITagModel[];
  production_companies: IProdCompanyModel[];
  external_ids: {
    tmdb: string;
    imdb: string;
    kinopoisk: string;
  };
  type: string;
  popularity: number;
}

export interface IShow extends IMedia {
  start_date: Date;
  end_date: Date;
  status: string;
  creators: IPerson[];
  total_episodes_time: number;
  episode_duration: number;
  episodes_count: number;
  number_of_seasons: number;
  number_of_episodes: number;
  platforms: ITVPlatformModel[];
  seasons: ISeason[];
}

export interface IMovie extends IMedia {
  release_date: string;
  director: IPerson[];
}

export interface IEpisode extends IGeneralMedia {
  show_id: number;
  poster_url: string;
  episode_type: string;
  season_number: number;
  episode_number: number;
  air_date: string;
}

export interface ISeason extends IGeneralMedia {
  show_id: number;
  poster_url: string;
  season_number: number;
  episode_count: number;
  air_date: Date | string;
  episodes: IEpisode[];
}
