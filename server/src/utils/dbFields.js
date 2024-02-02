import {
  People,
  Genre,
  Country,
  Tag,
  ProdCompany,
  TVPlatform,
  Season,
} from '../database/models/index.js';
import translate from 'translate';
import { createImgUrl, getImgPath } from './images.js';

export async function getCountries(countries) {
  const newCountries = [];
  // let i = 0;
  for (const country of countries) {
    let newCountry = await Country.findOne({ short_name: country.iso_3166_1 });
    if (!newCountry) {
      newCountry = await Country.create({
        short_name: country.iso_3166_1,
        name: country.name,
      });
    }
    //console.log(`Country: `, i++);
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
    //console.log(`Genre: ${i} из ${genres.length}`);
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
  let i = 1;
  switch (type) {
    case 'director':
      for (const people of credits.crew) {
        if (people.job === 'Director') {
          newPeoples.push(await addPeople(people, id, mediaType));
        }
        console.log(`Director: ${i++} из ${credits.crew.length}`);
      }
      return newPeoples;
    case 'actor':
      for (const people of credits.cast) {
        newPeoples.push(await addPeople(people, id, mediaType));
        console.log(`Cast: ${i++} из ${credits.cast.length}`);
      }
      return newPeoples;
    case 'creator':
      for (const people of credits) {
        newPeoples.push(await addPeople(people, id, mediaType));
        console.log(`Creator: ${i++} из ${credits.length}`);
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
  // let i = 0;
  for (const tag of tags) {
    let newTag = await Tag.findOne({ en: tag.name });
    if (!newTag) {
      newTag = await Tag.create({
        ru: await translate(tag.name, 'ru'),
        en: tag.name,
      });
    }
    //console.log('Tag: ', i++);
    newTags.push(newTag._id);
  }
  return newTags;
}

export async function getProdCompanies(companies) {
  const newCompanies = [];
  // let i = 0;
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
    //console.log('Company: ', i++);
    newCompanies.push(newCompany._id);
  }
  return newCompanies;
}

export async function getPlatforms(platforms) {
  const newPlatforms = [];
  // let i = 0;
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
    //console.log('Platform: ', i++);
    newPlatforms.push(newPlatform._id);
  }
  return newPlatforms;
}

export async function getSeasons(seasons) {
  const newSeasons = [];
  // let i = 0;
  for (const season of seasons) {
    let newSeason = await Season.findOne({ name: season.name });
    if (!newSeason) {
      await Season.create({
        name: season.name,
      });
      newSeason = await Season.findOne({ name: season.name });
      newSeason.logo_url = await createImgUrl(
        newSeason.id,
        'season',
        season.logo_path,
      );
      await newSeason.save();
    }
    //console.log('Season: ', i++);
    newSeasons.push(newSeason._id);
  }
  return newSeasons;
}
