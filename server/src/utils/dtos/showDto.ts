import type { ISeasonShort, IShow, IShowSearchResult } from '#interfaces/IApp';
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
  ISeasonModel,
  IShowModel,
  ITVPlatformModel,
  ITagModel,
} from '#interfaces/IModel';
import { format } from 'date-fns';
import {
  getCountries,
  getGenres,
  getPeoples,
  getProdCompanies,
  getTVPlatforms,
  getTags,
} from '#utils/mediaFields';
import type { Types } from 'mongoose';
import { SeasonShort } from './seasonDto';

export class Show implements IShow {
  id: number;
  title: string;
  title_original: string;
  start_date: string;
  end_date: string;
  status: string;
  total_episodes_time: number;
  episode_duration: number;
  number_of_seasons: number;
  number_of_episodes: number;
  watch_count: number;
  seasons: ISeasonShort[];
  description: string;
  description_original: string;
  images: IImages;
  genres: IGenreModel[];
  creators: IPerson[];
  cast: IPerson[];
  countries: ICountryModel[];
  platforms: ITVPlatformModel[];
  tags: ITagModel[];
  production_companies: IProdCompanyModel[];
  external_ids: IExternalIds;
  type: string;
  popularity: number;
  rating: number;
  ratings: IRatings;
  reactions: IReactions;
  comments: Types.ObjectId | ICommentsMediaModel;
  commentsCount: number;
  createdAt?: Date;
  updatedAt?: Date;
  constructor(model: IShowModel) {
    this.id = model.id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.images = model.images;
    this.start_date = format(new Date(model.start_date), 'dd.MM.yyyy');
    this.end_date = format(new Date(model.end_date), 'dd.MM.yyyy');
    this.status = model.status;
    this.creators = getPeoples(model.creators);
    this.genres = getGenres(model.genresId);
    this.countries = getCountries(model.countriesId);
    this.cast = getPeoples(model.cast);
    this.description = model.description;
    this.description_original = model.description_original;
    this.tags = getTags(model.tagsId);
    this.total_episodes_time = model.total_episodes_time;
    this.episode_duration = model.episode_duration;
    this.number_of_seasons = model.number_of_seasons;
    this.number_of_episodes = model.number_of_episodes;
    this.seasons = this.getSeasons(model.seasons);
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
    this.commentsCount = model.commentsCount;
  }

  getSeasons(seasons: ISeasonModel[]): SeasonShort[] {
    return seasons.map((item) => {
      return new SeasonShort(item);
    });
  }
}

export class ShowShort implements IShowSearchResult {
  id: number;
  title: string;
  title_original: string;
  start_date: string;
  end_date: string;
  status: string;
  total_episodes_time: number;
  episode_duration: number;
  episodes_count: number;
  number_of_seasons: number;
  number_of_episodes: number;
  platforms: ITVPlatformModel[];
  creators: IPerson[];
  images: IImages;
  genres: IGenreModel[];
  countries: ICountryModel[];
  description: string;
  description_original: string;
  rating: number;
  type: string;
  watch_count: number;
  popularity: number;
  constructor(model: IShowModel) {
    this.id = model.id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.images = model.images;
    this.start_date = format(new Date(model.start_date), 'dd.MM.yyyy');
    this.end_date = format(new Date(model.end_date), 'dd.MM.yyyy');
    this.creators = getPeoples(model.creators);
    this.description = model.description;
    this.description_original = model.description_original;
    this.rating = model.rating;
    this.popularity = model.popularity;
  }
}

export class ShowSuperShort {
  id: number;
  title: string;
  title_original: string;
  status: string;
  total_episodes_time: number;
  episode_duration: number;
  number_of_seasons: number;
  number_of_episodes: number;
  image_url: string;
  rating: number;
  constructor(model: IShowModel) {
    this.id = model.id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.status = model.status;
    this.image_url =
      model.images.backdrop_url ||
      model.images.poster_url.ru ||
      model.images.poster_url.en;
    this.total_episodes_time = model.total_episodes_time;
    this.episode_duration = model.episode_duration;
    this.number_of_seasons = model.number_of_seasons;
    this.number_of_episodes = model.number_of_episodes;
    this.rating = model.rating;
  }
}
