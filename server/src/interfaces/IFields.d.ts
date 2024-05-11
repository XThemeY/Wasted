import { Types } from 'mongoose';
import type { JwtPayload } from 'jsonwebtoken';
import type {
  ICountryModel,
  IGenreModel,
  IPeopleModel,
  IProdCompanyModel,
  ITVPlatformModel,
  ITagModel,
} from './IModel';
export interface IRatings {
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
}

export interface IPerson {
  person: IPeopleModel;
  role: string;
}

export interface IPersonJob {
  id: number;
  role: string;
  job: string;
}

export interface IImages {
  poster_url: {
    ru: string;
    en: string;
  };
  logo_url: {
    ru: string;
    en: string;
  };
  backdrop_url: string;
}

export interface IReactions {
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
}

export interface ICommentReactions {
  broken_heart: {
    value: number;
    vote_count: number;
  };
  clown_face: {
    value: number;
    vote_count: number;
  };
  dislike: {
    value: number;
    vote_count: number;
  };
  dizzy_face: {
    value: number;
    vote_count: number;
  };
  face_vomiting: {
    value: number;
    vote_count: number;
  };
  fire: {
    value: number;
    vote_count: number;
  };
  grin: {
    value: number;
    vote_count: number;
  };
  heart_eyes: {
    value: number;
    vote_count: number;
  };
  heart: {
    value: number;
    vote_count: number;
  };
  joy: {
    value: number;
    vote_count: number;
  };
  like: {
    value: number;
    vote_count: number;
  };
  muscle: {
    value: number;
    vote_count: number;
  };
  neutral_face: {
    value: number;
    vote_count: number;
  };
  rude_face: {
    value: number;
    vote_count: number;
  };
}

export interface ITag extends ITagModel {
  id: number;
  ru: string;
  en: string;
}

export interface IGenre extends IGenreModel {
  id: number;
  ru: string;
  en: string;
}

export interface ICountry extends ICountryModel {
  id: number;
  short_name: string;
  name: string;
}

export interface IProdCompany extends IProdCompanyModel {
  id: number;
  name: string;
  logo_url: string;
}
export interface IExternalIds {
  tmdb: string;
  imdb: string;
  kinopoisk: string;
}

export interface ITVPlatform extends ITVPlatformModel {
  id: number;
  name: string;
  logo_url: string;
}

export interface IUserDto {
  username: string;
  _id: Types.ObjectId;
  id: number;
  userRoles: string[];
  refreshToken?: string;
  activationLink?: string;
}
export interface ICookies {
  accessToken?: string;
  refreshToken?: string;
  user: IUserDto;
}

export interface IJwtPayload extends JwtPayload {
  _id: Types.ObjectId;
  username: string;
}
interface IHeaders extends Headers {
  authorization: string;
}
