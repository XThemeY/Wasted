import type { Types } from 'mongoose';
import type { JwtPayload } from 'jsonwebtoken';
import type { IPeopleModel } from './IModel';
import type {
  Rating,
  Ratings,
  Reaction,
  Reactions,
  WastedRating,
} from '#types/types';
export interface IRatings extends Ratings {
  wasted: WastedRating;
  tmdb: Rating;
  imdb: Rating;
  kinopoisk: Rating;
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
export interface IReactions extends Reactions {
  shocked: Reaction;
  thrilled: Reaction;
  scared: Reaction;
  sad: Reaction;
  touched: Reaction;
  bored: Reaction;
  confused: Reaction;
  amused: Reaction;
  tense: Reaction;
  reflective: Reaction;
}

export interface ICommentReactions extends Reactions {
  broken_heart: Reaction;
  clown_face: Reaction;
  dislike: Reaction;
  dizzy_face: Reaction;
  face_vomiting: Reaction;
  fire: Reaction;
  grin: Reaction;
  heart_eyes: Reaction;
  heart: Reaction;
  joy: Reaction;
  like: Reaction;
  muscle: Reaction;
  neutral_face: Reaction;
  rude_face: Reaction;
}
export interface IExternalIds {
  tmdb: number;
  imdb: string;
  kinopoisk: number;
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
