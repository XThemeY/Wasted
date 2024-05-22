import type { IMediaSearchResult, ISeasonShort, IShow } from '#interfaces/IApp';
import type {
  IExternalIds,
  IImages,
  IPerson,
  IRatings,
  IReactions,
} from '#interfaces/IFields';
import type {
  ICommentsMediaModel,
  ICountryModel,
  IGenreModel,
  IProdCompanyModel,
  IShowModel,
  ITVPlatformModel,
  ITagModel,
} from '#interfaces/IModel';
import { formatISO } from 'date-fns';
import {
  getCountries,
  getGenres,
  getPeoples,
  getProdCompanies,
  getTVPlatforms,
  getTags,
} from '#utils/mediaFields';
import type { Types } from 'mongoose';

export class Show implements IShow {
  start_date: string;
  end_date: string;
  status: string;
  creators: IPerson[];
  total_episodes_time: number;
  episode_duration: number;
  number_of_seasons: number;
  number_of_episodes: number;
  platforms: ITVPlatformModel[];
  seasons: ISeasonShort[];
  images: IImages;
  genres: IGenreModel[];
  countries: ICountryModel[];
  cast: IPerson[];
  tags: ITagModel[];
  production_companies: IProdCompanyModel[];
  external_ids: IExternalIds;
  type: string;
  popularity: number;
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
  comments: Types.ObjectId | ICommentsMediaModel;
  createdAt?: Date;
  updatedAt?: Date;
  constructor(model: IShowModel) {
    this.id = model.id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.images = model.images;
    this.start_date = formatISO(new Date(model.start_date), {
      representation: 'date',
    });
    this.end_date = formatISO(new Date(model.end_date), {
      representation: 'date',
    });
    this.status = model.status;
    this.creators = getPeoples(model.creators);
    this.genres = getGenres(model.genresId);
    this.countries = getCountries(model.countriesId);
    this.cast = getPeoples(model.cast);
    this.description = model.description;
    this.description_original = model.description_original;
    this.tags = getTags(model.tagsId);
    this.duration = model.duration;
    this.total_episodes_time = model.total_episodes_time;
    this.episode_duration = model.episode_duration;
    this.number_of_seasons = model.number_of_seasons;
    this.number_of_episodes = model.number_of_episodes;
    //this.seasons =
    this.platforms = getTVPlatforms(model.platformsId);
    this.production_companies = getProdCompanies(model.production_companiesId);
    this.reactions = model.reactions;
    this.rating = model.rating;
    this.ratings = model.ratings;
    this.type = model.type;
    this.watch_count = model.watch_count;
    this.popularity = model.popularity;
    this.external_ids = model.external_ids;
    this.comments = model.comments;
  }
}

export class ShowShort implements IMediaSearchResult {
  id: number;
  title: string;
  title_original: string;
  images: IImages;
  genres: IGenreModel[];
  countries: ICountryModel[];
  creators: IPerson[];
  description: string;
  description_original: string;
  duration: number;
  rating: number;
  type: string;
  watch_count: number;
  popularity: number;
  start_date: string;
  constructor(model: IShowModel) {
    this.id = model.id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.images = model.images;
    this.start_date = formatISO(new Date(model.start_date), {
      representation: 'date',
    });
    this.creators = getPeoples(model.creators);
    this.description = model.description;
    this.description_original = model.description_original;
    this.duration = model.duration;
    this.rating = model.rating;
  }
}
