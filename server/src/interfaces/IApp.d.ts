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
  ICommentModel,
  ITVPlatformModel,
} from './IModel';

export interface IMovieUpdate {
  title: string;
  title_original: string;
  images: IImages;
  release_date: Date;
  genres: IGenreModel[];
  countries: ICountryModel[];
  tags: ITagModel[];
  description: string;
  description_original: string;
  duration: number;
  production_companies: IProdCompanyModel[];
  external_ids: IExternalIds;
  type: string;
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

interface IMedia {
  id: number;
  title: string;
  title_original: string;
  images: IImages;
  genres: IGenreModel[];
  countries: ICountryModel[];
  cast: IPerson[];
  watch_count: number;
  description: string;
  description_original: string;
  tags: ITagModel[];
  duration: number;
  production_companies: IProdCompanyModel[];
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
  seasons: Types.ObjectId[];
}

export interface IMovie extends IMedia {
  release_date: string;
  director: IPerson[];
}
