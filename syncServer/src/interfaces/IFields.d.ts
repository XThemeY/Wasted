import { Types } from 'mongoose';

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
  person: number | Types.ObjectId;
  name?: string;
  profile_path?: string;
  character?: string;
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

export interface ISeason {
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
