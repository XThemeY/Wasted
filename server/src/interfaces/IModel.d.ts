import type { Document, Types } from 'mongoose';
import type {
  IImages,
  IRatings,
  ICommentReactions,
  IPersonJob,
  IReactions,
  IPerson,
  ISocialProfiles,
  IGameProfiles,
  ISettings,
} from './IFields.d.ts';
import type {
  ItemRating,
  MergeEpisode,
  MergeMovie,
  UserReaction,
  WastedItem,
} from '#types/types.js';

export interface IUserModel extends Document {
  id: number;
  username: string;
  email: string;
  authentication?: {
    password: string;
    activationLink: string;
    isActivated: boolean;
  };
  favorites: IFavoriteModel;
  ratings: IUserRatingsModel;
  reactions: Types.ObjectId | IUserReactionsModel;
  wastedHistory: Types.ObjectId | IWastedHistoryModel;
  commentReactions: Types.ObjectId | IUserCommentReactionsModel;
  socialProfiles: ISocialProfiles;
  gameProfiles: IGameProfiles;
  settings: ISettings;
  createdAt: Date;
}

interface IGeneralMediaModel extends Document {
  id: number;
  title: string;
  title_original: string;
  watch_count: number;
  description: string;
  description_original: string;
  rating: number;
  ratings: IRatings;
  reactions: IReactions;
  comments: Types.ObjectId | ICommentsMediaModel;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IMediaModel extends IGeneralMediaModel {
  images: IImages;
  genres: number[];
  countries: number[];
  cast: IPerson[];
  tags: number[];
  production_companies: number[];
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
  commentsCount: number;
}

export interface IMovieModel extends IMediaModel {
  release_date: Date;
  duration: number;
  director: IPerson[];
  commentsCount: number;
}

export interface ISeasonModel extends IGeneralMediaModel {
  show_id: number;
  poster_url: string;
  season_number: number;
  episode_count: number;
  air_date: Date;
  episodes: IEpisodeModel[];
  commentsCount: number;
}

export interface IEpisodeModel extends IGeneralMediaModel {
  show?: IShowModel;
  show_id: number;
  poster_url: string;
  duration: number;
  episode_type: string;
  season_number: number;
  episode_number: number;
  air_date: Date;
  commentsCount: number;
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
  comments: Types.ObjectId | ICommentsMediaModel;
  createdAt?: Date;
  updatedAt?: Date;
  commentsCount: number;
}
export interface ICommentModel {
  id: number;
  username: string;
  parent_comments_id: number;
  comment_body: string;
  images_url: string[];
  reactions: ICommentReactions;
  isDeleted: boolean;
  isHidden: boolean;
  isChanged: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentsMediaModel {
  media_id: number;
  comments: ICommentModel[];
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
  ratingsShows?: { tvShows: { episodes: IEpisodeModel[] } };
  ratingsMovies?: IMovieModel[];
  mergeMovies?: MergeMovie[];
  mergeEpisodes?: MergeEpisode[];
  movies: ItemRating[];
  tvShows: { episodes: ItemRating[] };
  games: ItemRating[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWastedHistoryModel {
  username: string;
  movies: WastedItem[];
  tvShows: WastedItem[];
  games: WastedItem[];
}

export interface IFavoriteModel {
  username: string;
  movies?: [number];
  tvShows?: { shows: [number]; episodes: [number] };
  favoriteMovies: IMovieModel[];
  favoriteShows: { shows: IShowModel[]; episodes: IEpisodeModel[] };
  games: [number];
}

export interface IUserCommentReactionsModel {
  username: string;
  comments: [{ commentId: number; reactions: [string] }];
}
