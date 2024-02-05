import {
  People,
  Genre,
  Country,
  Tag,
  ProdCompany,
  TVPlatform,
  Season,
  Episode,
} from '../database/models/index.js';
import translate from 'translate';
import { createImgUrl, getImgPath } from './images.js';
import logEvents from '../middleware/logEvents.js';
import axios from 'axios';

const axiosShow = axios.create({
  baseURL: process.env.TMDB_API_URL,
});
axiosShow.defaults.headers.common['Authorization'] =
  `Bearer ${process.env.TMDB_API_TOKEN}`;

export async function getCountries(countries) {
  const newCountries = [];

  for (const country of countries) {
    let newCountry = await Country.findOne({ short_name: country.iso_3166_1 });
    if (!newCountry) {
      newCountry = await Country.create({
        short_name: country.iso_3166_1,
        name: country.name,
      });
    }

    newCountries.push(newCountry._id);
  }
  return newCountries;
}

export async function getGenres(genres, genresENG) {
  const newGenres = [];
  for (let i = 0; i < genres.length; i++) {
    let genre = await Genre.findOne({ ru: genres[i].name });
    if (!genre) {
      genre = await Genre.create({
        ru: genres[i].name,
        en: genresENG[i].name,
      });
    }

    newGenres.push(genre._id);
  }
  return newGenres;
}

export async function getMediaImages(id, mediaType, model) {
  const images = {
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

export async function getPeoples(credits, type, id, mediaType) {
  const newPeoples = [];

  switch (type) {
    case 'director':
      for (const people of credits.crew) {
        if (people.job === 'Director') {
          newPeoples.push(await addPeople(people, id, mediaType));
        }
      }
      return newPeoples;
    case 'actor':
      for (const people of credits.cast) {
        newPeoples.push(await addPeople(people, id, mediaType));
      }
      return newPeoples;
    case 'creator':
      for (const people of credits) {
        newPeoples.push(await addPeople(people, id, mediaType));
      }
      return newPeoples;
  }
}

async function addPeople(people, id, mediaType) {
  let newPeople = await People.findOne({ name: people.name });
  if (!newPeople) {
    await People.create({
      name: people.name,
    });
    newPeople = await People.findOne({ name: people.name });
    newPeople.profile_img = await createImgUrl(
      newPeople.id,
      'people',
      people.profile_path,
    );

    if (mediaType === 'movie') {
      const movie = { id, role: people.character, job: people.job };
      newPeople.movies = [...newPeople.movies, movie];
    }
    if (mediaType === 'show') {
      const show = { id, role: people.character, job: people.job };
      newPeople.shows = [...newPeople.shows, show];
    }
    await newPeople.save();
  }
  return newPeople._id;
}

export async function getTags(tags) {
  const newTags = [];

  for (const tag of tags) {
    let newTag = await Tag.findOne({ en: tag.name });
    if (!newTag) {
      newTag = await Tag.create({
        ru: await translate(tag.name, 'ru'),
        en: tag.name,
      });
    }

    newTags.push(newTag._id);
  }
  return newTags;
}

export async function getProdCompanies(companies) {
  const newCompanies = [];

  for (const company of companies) {
    let newCompany = await ProdCompany.findOne({ name: company.name });
    if (!newCompany) {
      await ProdCompany.create({
        name: company.name,
      });
      newCompany = await ProdCompany.findOne({ name: company.name });
      newCompany.logo_url = await createImgUrl(
        newCompany.id,
        'company',
        company.logo_path,
      );
      await newCompany.save();
    }

    newCompanies.push(newCompany._id);
  }
  return newCompanies;
}

export async function getPlatforms(platforms) {
  const newPlatforms = [];

  for (const platform of platforms) {
    let newPlatform = await TVPlatform.findOne({ name: platform.name });
    if (!newPlatform) {
      await TVPlatform.create({
        name: platform.name,
      });
      newPlatform = await TVPlatform.findOne({ name: platform.name });
      newPlatform.logo_url = await createImgUrl(
        newPlatform.id,
        'platform',
        platform.logo_path,
      );
      await newPlatform.save();
    }

    newPlatforms.push(newPlatform._id);
  }
  return newPlatforms;
}

export async function getSeasons(id, seasons, seasonsENG, tmdbID) {
  const newSeasons = [];

  for (let i = 0; i < seasons.length; i++) {
    let newSeason = await Season.findOne({
      show_id: id,
      season_number: seasons[i].season_number,
    });
    if (!newSeason) {
      await Season.create({
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

      newSeason = await Season.findOne({
        show_id: id,
        season_number: seasons[i].season_number,
      });

      newSeason.episodes = await getEpisodes(
        id,
        tmdbID,
        newSeason.season_number,
      );
      newSeason.poster_url = await createImgUrl(
        newSeason.id,
        'season',
        seasons[i].poster_path,
      );
      await newSeason.save();
    }

    newSeasons.push(newSeason._id);
  }

  return newSeasons;
}

async function getEpisodes(id, tmdbID, seasonNumber) {
  const newEpisodes = [];

  try {
    const response = await axiosShow.get(
      '/tv/' + tmdbID + '/season/' + seasonNumber + '?language=ru-RU',
    );
    const responseENG = await axiosShow.get(
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
        await Episode.create({
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
        newEpisode = await Episode.findOne({
          show_id: id,
          season_number: episodes[i].season_number,
          episode_number: episodes[i].episode_number,
        });
        newEpisode.poster_url = await createImgUrl(
          newEpisode.id,
          'episode',
          episodes[i].still_path,
        );
        await newEpisode.save();
      }
      newEpisodes.push(newEpisode._id);
    }
  } catch (error) {
    logEvents(
      `${'id:' + tmdbID + '-' + error?.name || error}: ${error?.message || error}`,
      'showReqLog.log',
    );
    console.log(
      `ID:${tmdbID} Ошибка запроса эпизода `,
      error?.message || error,
    );
  }
  return newEpisodes;
}
