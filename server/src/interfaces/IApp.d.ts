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
  ICommentsMediaModel,
} from './IModel';
import type { EpisodeShort } from '#utils/dtos/episodeDto';
import { WastedItem } from '#types/types';

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

export interface IErrMsg {
  message: string;
}

interface IGeneralMedia {
  id: number;
  title: string;
  title_original: string;
  description: string;
  description_original: string;
  rating: number;
  reactions: IReactions;
  comments: Types.ObjectId | ICommentsMediaModel;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IMedia extends IGeneralMedia {
  images: IImages;
  genres: IGenreModel[];
  countries: ICountryModel[];
  cast: IPerson[];
  tags: ITagModel[];
  watch_count: number;
  ratings: IRatings;
  production_companies: IProdCompanyModel[];
  external_ids: {
    tmdb: number;
    imdb: string;
    kinopoisk: number;
  };
  type: string;
  popularity: number;
}

export interface IShow extends IMedia {
  start_date: Date | string;
  end_date: Date | string;
  status: string;
  creators: IPerson[];
  total_episodes_time: number;
  episode_duration: number;
  number_of_seasons: number;
  number_of_episodes: number;
  platforms: ITVPlatformModel[];
  seasons: ISeasonShort[];
}

export interface IMovie extends IMedia {
  duration: number;
  release_date: Date | string;
  director: IPerson[];
}

export interface IEpisode extends IGeneralMedia {
  show_id: number;
  duration: number;
  poster_url: string;
  episode_type: string;
  season_number: number;
  episode_number: number;
  air_date: Date | string;
  watch_count: number;
}

export interface ISeason extends IGeneralMedia {
  show_id: number;
  poster_url: string;
  season_number: number;
  episode_count: number;
  air_date: Date | string;
  episodes: EpisodeShort[];
}

export interface IGame {}

export interface IWastedResponse {
  username: string;
  mediaId: number;
  status: string;
  watch_count: number;
}

export interface IUserWastedHistory {
  items: {
    movies: WastedItem[];
    shows: WastedItem[];
    games: WastedItem[];
  };
  total_time: number;
}

interface IShort {
  id: number;
  title: string;
  title_original: string;
}

export interface ISeasonShort extends IShort {
  show_id: number;
  season_number: number;
  episode_count: number;
  air_date: Date | string;
  episodes: IEpisodeShort[];
  commentsCount: number;
}

export interface IEpisodeShort extends IShort {
  show_id: number;
  episode_type: string;
  duration: number;
  season_number: number;
  episode_number: number;
  air_date: string;
  rating: number;
  commentsCount: number;
}

export interface ISearchQuery {
  page: number;
  limit: number;
  sort_by: [string, SortOrder];
  title: string;
  start_year: Date | number;
  end_year: Date | number;
  start_year_default: Date;
  end_year_default: Date;
  genres: number[];
  countries: number[];
  wastedIds: number[];
  tvPlatforms?: number[];
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
  rating: number;
  type: string;
  watch_count: number;
  popularity: number;
}

export interface IMovieSearchResult extends IMediaSearchResult {
  release_date: string;
  director: IPerson[];
  duration: number;
}

export interface IShowSearchResult extends IMediaSearchResult {
  start_date: string;
  end_date: string;
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
