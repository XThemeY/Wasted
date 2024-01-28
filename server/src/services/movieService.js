import { Movie, People, Genre, Country } from '../db/models/index.js';

import { createImgUrl, getImgPath } from '../helpers/images.js';

class MovieService {
  async addMovieToDb(model, modelENG) {
    const newMovie = await Movie.create({
      title: model.title,
      title_original: model.original_title,
      release_date: model.release_date,
      description: model.overview,
      description_original: modelENG.overview,

      duration: model.runtime,
      // production_companies: {},
      ratings: {
        tmdb: {
          raiting: model.vote_average,
          vote_count: model.vote_count,
        },
        //imdb: { type: Number, default: 0 },
        //kinopoisk: { type: Number, default: 0 },
      },
      external_ids: {
        tmdb: model.id,
        imdb: model.imdb_id,
        //kinopoisk: { type: String },
      },
    });

    const movie = await Movie.findOne({ id: newMovie.id });

    movie.images = await getMediaImages(movie.id, 'movie', model);
    movie.genres = await getGenres(model.genres, modelENG.genres);
    movie.countries = await getCountries(model.production_countries);
    movie.director = await getPeoples(
      movie._id,
      model.credits,
      'director',
      'movie',
    );
    movie.cast = await getPeoples(movie._id, model.credits, 'actor', 'movie');
    // tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    //movie.tags = await getTags();
    await movie.save();
  }
}
export default new MovieService();

async function getCountries(countries) {
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

async function getGenres(genres, genresENG) {
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

async function getMediaImages(id, mediaType, model) {
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

async function getPeoples(id, credits, type, mediaType) {
  const newPeoples = [];

  switch (type) {
    case 'director':
      for (const people of credits.crew) {
        if (people.job === 'Director') {
          await addPeople(people);
        }
      }
      return newPeoples;
    case 'actor':
      for (const people of credits.cast) {
        await addPeople(people);
      }
      return newPeoples;
  }

  async function addPeople(people) {
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
    newPeoples.push(newPeople._id);
  }
}

async function getTags(tags, tagsENG) {
  const newTags = [];

  for (let i = 0; i < genres.length; i++) {
    let genre = await Genre.findOne({ ru: genres[i].name });
    if (!genre) {
      genre = await Genre.create({
        ru: genres[i].name,
        en: genresENG[i].name,
      });
    }
    newTags.push(genre._id);
  }
  return newTags;
}
