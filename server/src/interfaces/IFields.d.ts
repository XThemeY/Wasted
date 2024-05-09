import { Document, Types } from 'mongoose';
import type { JwtPayload } from 'jsonwebtoken';
export interface IImages {
  backdrop_url: string;
  poster_url: {
    ru: string;
    en: string;
  };
  logo_url: {
    ru: string;
    en: string;
  };
  logos?: IPathImage[];
  backdrops?: IPathImage[];
  posters?: IPathImage[];
}

export interface IPathImage {
  iso_639_1: string;
  file_path: string;
}

export interface IPeople {
  id?: number;
  original_name?: string;
  person: number | Types.ObjectId;
  profile_path?: string;
  character?: string;
  tmdb_id?: number;
  role: string;
  job?: string;
}

export interface ICredits {
  entries(): IterableIterator<[number, IPeople]>;
  crew?: IPeople[];
  cast?: IPeople[];
  length?: number;
}

export interface ICountry {
  iso_3166_1?: string;
  name?: string;
}

export interface IGenre {
  name: string;
}

export interface ITag {
  name: string;
}

export interface IProdCompany {
  name: string;
  logo_path?: string;
}

export interface IPlatform {
  name: string;
  logo_path?: string;
}

export interface IEpisode extends Types.ObjectId {}

export interface ISeason extends Types.ObjectId {
  season_number: number;
  name: string;
  overview: string;
  air_date: Date;
  episode_count: number;
  poster_path?: string;
  vote_average: number;
  vote_count: number;
}
export interface ILogs {
  type: string;
  index: number;
  length: number;
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

export interface IToken extends Document {
  user?: Types.ObjectId;
  refreshToken: string;
  _id: Types.ObjectId;
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
}
export interface IReqWithUserData extends Request {
  user?: IJwtPayload;
  headers: IHeaders;
}
interface IHeaders extends Headers {
  authorization: string;
}
