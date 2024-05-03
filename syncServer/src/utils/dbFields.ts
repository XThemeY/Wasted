import translate from 'translate';
import { tmdbApiConfig } from '#api/ApiConfigs.js';
import {
  People,
  Genre,
  Country,
  Tag,
  ProdCompany,
  TVPlatform,
  Season,
  Episode,
} from '#db/models/index.js';
import { createImgUrl, getImgPath } from './images.js';
import type {
  ICountry,
  ICredits,
  IImages,
  IGenre,
  IPeople,
  IPlatform,
  IProdCompany,
  ISeason,
  ITag,
  ILogs,
  IEpisode,
} from '#interfaces/IFields.d.ts';
import type { IMediaModel } from '#interfaces/IModel.d.ts';
import { logger } from '#middleware/index.js';
import { logNames } from '#config/index.js';
import ApiError from './apiError.js';

const fieldsLogger = logger(logNames.dbFields).child({ module: 'dbFields' });

const axiosFields = tmdbApiConfig();

export async function getCountries(countries: ICountry[]): Promise<ICountry[]> {
  const newCountries = [];

  for (const country of countries) {
    let newCountry = await Country.findOne({ short_name: country.iso_3166_1 });
    if (!newCountry) {
      newCountry = await Country.create({
        short_name: country.iso_3166_1,
        name: country.name,
      });
      fieldsLogger.info(
        { countryId: newCountry.id },
        `Country: ${newCountry.id} был добавлен`,
      );
    }
    newCountries.push(newCountry.id);
  }
  if (!countries.length) {
    newCountries.push(0);
  }
  return newCountries;
}

export async function getGenres(
  genres: IGenre[],
  genresENG: IGenre[],
): Promise<IGenre[]> {
  const newGenres = [];
  for (let i = 0; i < genres.length; i++) {
    let genre = await Genre.findOne({ ru: genres[i].name });
    if (!genre) {
      genre = await Genre.create({
        ru: genres[i].name,
        en: genresENG[i].name,
      });
      fieldsLogger.info(
        { genreId: genre.id },
        `Genre: ${genre.id} был добавлен`,
      );
    }

    newGenres.push(genre.id);
  }
  return newGenres;
}

export async function getMediaImages(
  id: number,
  mediaType: string,
  model: IMediaModel,
): Promise<IImages> {
  const images: IImages = {
    poster_url: {
      ru: await createImgUrl(id, mediaType, model.poster_path),
      en: await createImgUrl(
        id,
        mediaType,
        getImgPath(model.images.posters, 'en'),
      ),
    },
    logo_url: {
      ru: await createImgUrl(
        id,
        mediaType,
        getImgPath(model.images.logos, 'ru'),
      ),
      en: await createImgUrl(
        id,
        mediaType,
        getImgPath(model.images.logos, 'en'),
      ),
    },
    backdrop_url: await createImgUrl(id, mediaType, model.backdrop_path),
  };
  return images;
}

export async function getPeoples(
  credits: ICredits,
  type: string,
  id: number,
  mediaType: string,
): Promise<IPeople[]> {
  const newPeoples = [];
  switch (type) {
    case 'director':
      for (const [index, people] of credits.crew.entries()) {
        if (people.job === 'Director') {
          newPeoples.push(
            await addPeople(people, id, mediaType, {
              type,
              index,
              length: credits.crew.length,
            }),
          );
        }
      }
      return newPeoples;
    case 'actor':
      for (const [index, people] of credits.cast.entries()) {
        newPeoples.push(
          await addPeople(people, id, mediaType, {
            type,
            index,
            length: credits.cast.length,
          }),
        );
      }
      return newPeoples;
    case 'creator':
      for (const [index, people] of credits.entries()) {
        newPeoples.push(
          await addPeople(people, id, mediaType, {
            type,
            index,
            length: credits.length,
          }),
        );
      }
      return newPeoples;
    default:
      return newPeoples;
  }
}

async function addPeople(
  people: IPeople,
  id: number,
  mediaType: string,
  logs: ILogs,
): Promise<IPeople> {
  let newPeople = await People.findOne({ original_name: people.original_name });
  if (!newPeople) {
    newPeople = await People.create({
      name: await translate(people.original_name, 'ru'),
      original_name: people.original_name,
    });
    newPeople.profile_img = await createImgUrl(
      newPeople.id,
      'people',
      people.profile_path,
    );

    fieldsLogger.info(
      { peopleId: newPeople.id },
      `${logs.type}: ${logs.index} из ${logs.length} был добавлен`,
    );
  }

  switch (mediaType) {
    case 'movie':
      if (!newPeople.movies.find((item) => item.id === id)) {
        const movie = { id, role: people.character, job: people.job };
        await People.findOneAndUpdate(
          { name: people.name },
          { $push: { movies: movie } },
          { upsert: true },
        );
      }
      break;
    case 'show':
      if (!newPeople.shows.find((item) => item.id === id)) {
        const show = {
          id,
          role: people.character,
          job: !people.character ? 'Creator' : people.job,
        };
        await People.findOneAndUpdate(
          { name: people.name },
          { $push: { shows: show } },
          { upsert: true },
        );
      }
      break;
    default:
      break;
  }
  return {
    person: newPeople._id,
    role: people.character,
    job: !people.character ? 'Creator' : people.job,
  };
}

export async function getTags(tags: ITag[]): Promise<ITag[]> {
  const newTags = [];
  for (const tag of tags) {
    let newTag = await Tag.findOne({ en: tag.name });
    if (!newTag) {
      newTag = await Tag.create({
        ru: await translate(tag.name, 'ru'),
        en: tag.name,
      });
      fieldsLogger.info(
        { newTag: newTag.id },
        `Tag: ${newTag.id} был добавлен`,
      );
    }
    newTags.push(newTag.id);
  }
  return newTags;
}

export async function getProdCompanies(
  companies: IProdCompany[],
): Promise<IProdCompany[]> {
  const newCompanies = [];
  for (const company of companies) {
    let newCompany = await ProdCompany.findOne({ name: company.name });
    if (!newCompany) {
      newCompany = await ProdCompany.create({
        name: company.name,
      });
      newCompany.logo_url = await createImgUrl(
        newCompany.id,
        'company',
        company.logo_path,
      );
      await newCompany.save();
      fieldsLogger.info(
        { companyId: newCompany.id },
        `Company: ${newCompany.id} была добавлена`,
      );
    }
    newCompanies.push(newCompany.id);
  }
  return newCompanies;
}

export async function getPlatforms(
  platforms: IPlatform[],
): Promise<IPlatform[]> {
  const newPlatforms = [];
  for (const platform of platforms) {
    let newPlatform = await TVPlatform.findOne({ name: platform.name });
    if (!newPlatform) {
      newPlatform = await TVPlatform.create({
        name: platform.name,
      });
      newPlatform.logo_url = await createImgUrl(
        newPlatform.id,
        'platform',
        platform.logo_path,
      );
      await newPlatform.save();
      fieldsLogger.info(
        { platformId: newPlatform.id },
        `Platform: ${newPlatform.id} была добавлена`,
      );
    }
    newPlatforms.push(newPlatform.id);
  }
  return newPlatforms;
}

export async function getSeasons(
  id: number,
  seasons: ISeason[],
  seasonsENG: ISeason[],
  tmdbID: number,
): Promise<ISeason[]> {
  const newSeasons = [];

  for (let i = 0; i < seasons.length; i++) {
    let newSeason = await Season.findOne({
      show_id: id,
      season_number: seasons[i].season_number,
    });
    if (!newSeason) {
      newSeason = await Season.create({
        show_id: id,
        title: seasons[i].name,
        title_original: seasonsENG[i].name,
        season_number: seasons[i].season_number,
        episode_count: seasons[i].episode_count,
        description: seasons[i].overview,
        description_original: seasonsENG[i].overview,
        air_date: seasons[i].air_date,
        rating: seasons[i].vote_average,
      });

      newSeason.poster_url = await createImgUrl(
        newSeason.id,
        'season',
        seasons[i].poster_path,
      );
      fieldsLogger.info(
        { showId: newSeason.show_id, seasonId: newSeason.id },
        `Season: ${i} из ${seasons.length - 1} шоу с id:${id} добавлен`,
      );
    }
    newSeason.episodes = await getEpisodes(id, tmdbID, newSeason.season_number);
    await newSeason.save();
    newSeasons.push(newSeason._id);
  }
  return newSeasons;
}

async function getEpisodes(
  id: number,
  tmdbID: number,
  seasonNumber: number,
): Promise<IEpisode[]> {
  const newEpisodes = [];
  try {
    const response = await axiosFields.get(
      '/tv/' + tmdbID + '/season/' + seasonNumber + '?language=ru-RU',
    );
    const responseENG = await axiosFields.get(
      '/tv/' + tmdbID + '/season/' + seasonNumber + '?language=en-US',
    );
    const episodes = response.data.episodes;
    const episodesENG = responseENG.data.episodes;

    for (let i = 0; i < episodes.length; i++) {
      let newEpisode = await Episode.findOne({
        show_id: id,
        season_number: episodes[i].season_number,
        episode_number: episodes[i].episode_number,
      });

      if (!newEpisode) {
        newEpisode = await Episode.create({
          show_id: id,
          title: episodes[i].name,
          title_original: episodesENG[i].name,
          season_number: episodes[i].season_number,
          episode_number: episodes[i].episode_number,
          description: episodes[i].overview,
          description_original: episodesENG[i].overview,
          air_date: episodes[i].air_date,
          rating: episodes[i].vote_average,
          duration: episodes[i].runtime,
          episode_type: episodes[i].episode_type,
        });
        newEpisode.poster_url = await createImgUrl(
          newEpisode.id,
          'episode',
          episodes[i].still_path,
        );
        await newEpisode.save();
        fieldsLogger.info(
          `Episode c id:${newEpisode.id}: № ${i} из ${episodes.length - 1} шоу с id:${id} добавлен`,
        );
      }
      newEpisodes.push(newEpisode._id);
    }
    return newEpisodes;
  } catch (error) {
    throw ApiError.BadRequest(
      'Ошибка запроса эпизодов',
      error?.message || error,
    );
  }
}
