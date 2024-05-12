import type { IMovie, IMovieSearchResult } from '#interfaces/IApp.js';
import type {
  ICommentModel,
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
import { formatISO } from 'date-fns';
import {
  getGenres,
  getCountries,
  getPeoples,
  getTags,
  getProdCompanies,
} from '#utils/mediaFields';

export class Movie implements IMovie {
  id: number;
  title: string;
  title_original: string;
  images: IImages;
  release_date: string;
  genres: IGenreModel[];
  countries: ICountryModel[];
  director: IPerson[];
  cast: IPerson[];
  description: string;
  description_original: string;
  tags: ITagModel[];
  duration: number;
  production_companies: IProdCompanyModel[];
  reactions: IReactions;
  rating: number;
  ratings: IRatings;
  type: string;
  watch_count: number;
  popularity: number;
  external_ids: IExternalIds;
  comments: ICommentModel[];
  constructor(model: IMovieModel) {
    this.id = model.id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.images = model.images;
    this.release_date = formatISO(new Date(model.release_date), {
      representation: 'date',
    });
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
  }
}

export class MovieShort implements IMovieSearchResult {
  id: number;
  title: string;
  title_original: string;
  images: IImages;
  genres: IGenreModel[];
  countries: ICountryModel[];
  director: IPerson[];
  description: string;
  description_original: string;
  duration: number;
  rating: number;
  type: string;
  watch_count: number;
  popularity: number;
  release_date: string;
  constructor(model: IMovieModel) {
    this.id = model.id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.countries = getCountries(model.countriesId);
    this.images = model.images;
    this.release_date = formatISO(new Date(model.release_date), {
      representation: 'date',
    });
    this.director = getPeoples(model.director);
    this.genres = getGenres(model.genresId);
    this.description = model.description;
    this.description_original = model.description_original;
    this.duration = model.duration;
    this.rating = model.rating;
    this.type = model.type;
    this.watch_count = model.watch_count;
    this.popularity = model.popularity;
  }
}
