import type {
  ICountry,
  IExternalIds,
  IGenre,
  IImages,
  IPerson,
  IProdCompany,
  IRatings,
  IReactions,
  ITag,
} from '#interfaces/IFields';
import type {
  ICommentModel,
  ICountryModel,
  IGenreModel,
  IMovieModel,
  IProdCompanyModel,
  ITagModel,
} from '#interfaces/IModel';
import { formatISO } from 'date-fns';
import { Person } from './personDto.js';
import { IMediaSearchResult } from '#interfaces/IApp.js';

export class Movie {
  id: number;
  title: string;
  title_original: string;
  images: IImages;
  release_date: string;
  genres: IGenre[];
  countries: ICountry[];
  director: IPerson[];
  cast: IPerson[];
  watch_count: number;
  description: string;
  description_original: string;
  tags: ITag[];
  duration: number;
  production_companies: IProdCompany[];
  reactions: IReactions;
  rating: number;
  ratings: IRatings;
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
    this.genres = this.getGenres(model.genresId);
    this.countries = this.getCountries(model.countriesId);
    this.director = getPeoples(model.director);
    this.cast = getPeoples(model.cast);
    this.watch_count = model.watch_count;
    this.description = model.description;
    this.description_original = model.description_original;
    this.tags = this.getTags(model.tagsId);
    this.duration = model.duration;
    this.production_companies = this.getProdCompanies(
      model.production_companiesId,
    );
    this.reactions = model.reactions;
    this.rating = model.rating;
    this.ratings = model.ratings;
    this.external_ids = model.external_ids;
    this.comments = model.comments;
  }

  getTags(tags: ITagModel[]): ITag[] {
    return tags.map((tag) => {
      return {
        id: tag.id,
        ru: tag.ru,
        en: tag.en,
      };
    });
  }

  getProdCompanies(companies: IProdCompanyModel[]): IProdCompany[] {
    return companies.map((company) => {
      return {
        id: company.id,
        name: company.name,
        logo_url: company.logo_url,
      };
    });
  }

  getGenres(genres: IGenreModel[]): IGenre[] {
    return genres.map((genre) => {
      return {
        id: genre.id,
        ru: genre.ru,
        en: genre.en,
      };
    });
  }

  getCountries(countries: ICountryModel[]): ICountry[] {
    return countries.map((country) => {
      return {
        id: country.id,
        short_name: country.short_name,
        name: country.name,
      };
    });
  }
}

export class MovieShort implements IMediaSearchResult {
  id: number;
  title: string;
  title_original: string;
  images: IImages;
  genres: IGenre[];
  countries: ICountry[];
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
    this.images = model.images;
    this.release_date = formatISO(new Date(model.release_date), {
      representation: 'date',
    });
    this.director = getPeoples(model.director);
    this.description = model.description;
    this.description_original = model.description_original;
    this.duration = model.duration;
    this.rating = model.rating;
  }
}

export function getPeoples(people: IPerson[]): IPerson[] {
  return people.map((actor) => {
    return {
      person: new Person(actor.person),
      role: actor.role,
    };
  });
}
