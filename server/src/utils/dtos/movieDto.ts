import type { IMovie, IMovieSearchResult } from '#interfaces/IApp.js';
import type {
  ICommentsMediaModel,
  ICountryModel,
  IGenreModel,
  IMovieModel,
  IProdCompanyModel,
  ITagModel,
} from '#interfaces/IModel';
import type {
  IExternalIds,
  IImages,
  IPerson,
  IRatings,
  IReactions,
} from '#interfaces/IFields';
import { format } from 'date-fns';
import {
  getGenres,
  getCountries,
  getPeoples,
  getTags,
  getProdCompanies,
} from '#utils/mediaFields';
import type { Types } from 'mongoose';

export class Movie implements IMovie {
  id: number;
  title: string;
  title_original: string;
  release_date: string;
  duration: number;
  director: IPerson[];
  description: string;
  description_original: string;
  images: IImages;
  genres: IGenreModel[];
  countries: ICountryModel[];
  cast: IPerson[];
  tags: ITagModel[];
  production_companies: IProdCompanyModel[];
  reactions: IReactions;
  rating: number;
  ratings: IRatings;
  type: string;
  watch_count: number;
  popularity: number;
  external_ids: IExternalIds;
  comments: Types.ObjectId | ICommentsMediaModel;
  commentsCount: number;
  constructor(model: IMovieModel) {
    this.id = model.id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.images = model.images;
    this.release_date = format(new Date(model.release_date), 'dd.MM.yyyy');
    this.genres = getGenres(model.genresId);
    this.countries = getCountries(model.countriesId);
    this.director = getPeoples(model.director);
    this.cast = getPeoples(model.cast);
    this.description = model.description;
    this.description_original = model.description_original;
    this.tags = getTags(model.tagsId);
    this.duration = model.duration;
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
}

export class MovieShort implements IMovieSearchResult {
  id: number;
  title: string;
  title_original: string;
  release_date: string;
  duration: number;
  description: string;
  description_original: string;
  director: IPerson[];
  genres: IGenreModel[];
  images: IImages;
  countries: ICountryModel[];
  rating: number;
  type: string;
  watch_count: number;
  popularity: number;
  commentsCount: number;
  constructor(model: IMovieModel) {
    this.id = model.id;
    this.title = model.title;
    this.title_original = model.title_original;
    //this.countries = getCountries(model.countriesId);
    this.images = model.images;
    this.release_date = format(new Date(model.release_date), 'dd.MM.yyyy');
    this.director = getPeoples(model.director);
    // this.genres = getGenres(model.genresId);
    this.description = model.description;
    this.description_original = model.description_original;
    this.duration = model.duration;
    this.rating = model.rating;
    this.type = model.type;
    this.watch_count = model.watch_count;
    this.popularity = model.popularity;
    this.commentsCount = model.commentsCount;
  }
}
