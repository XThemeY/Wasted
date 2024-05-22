import { Person } from '#utils/dtos/index.js';
import type {
  ICountryModel,
  IGenreModel,
  IProdCompanyModel,
  ITVPlatformModel,
  ITagModel,
} from '#interfaces/IModel';
import type { IPerson } from '#interfaces/IFields';

export function getPeoples(people: IPerson[]): IPerson[] {
  return people.map((actor) => {
    return {
      person: new Person(actor.person),
      role: actor.role,
    };
  });
}

export function getCountries(countries: ICountryModel[]): ICountryModel[] {
  return countries.map((country) => {
    return {
      id: country.id,
      short_name: country.short_name,
      name: country.name,
    };
  });
}

export function getGenres(genres: IGenreModel[]): IGenreModel[] {
  return genres.map((genre) => {
    return {
      id: genre.id,
      ru: genre.ru,
      en: genre.en,
    };
  });
}

export function getTags(tags: ITagModel[]): ITagModel[] {
  return tags.map((tag) => {
    return {
      id: tag.id,
      ru: tag.ru,
      en: tag.en,
    };
  });
}

export function getProdCompanies(
  companies: IProdCompanyModel[],
): IProdCompanyModel[] {
  return companies.map((company) => {
    return {
      id: company.id,
      name: company.name,
      logo_url: company.logo_url,
    };
  });
}

export function getTVPlatforms(
  tvPlatforms: ITVPlatformModel[],
): ITVPlatformModel[] {
  return tvPlatforms.map((platform) => {
    return {
      id: platform.id,
      name: platform.name,
      logo_url: platform.logo_url,
    };
  });
}
