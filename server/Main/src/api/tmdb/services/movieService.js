import { Movie } from 'Main/src/database/models/index.js';
import {
  getMediaImages,
  getGenres,
  getCountries,
  getPeoples,
  getTags,
  getProdCompanies,
} from 'Main/src/utils/dbFields.js';
import { logEvents } from 'Main/src/api/v1/middleware/index.js';

class MovieService {
  async addMovieToDb(model, modelENG) {
    let movie = await Movie.findOne({ 'external_ids.tmdb': model.id });
    if (!movie) {
      const newMovie = await Movie.create({
        title: model.title,
        title_original: model.original_title,
        release_date: model.release_date,
        description: model.overview,
        description_original: modelENG.overview,
        duration: model.runtime,
        rating: model.vote_average,
        ratings: {
          tmdb: {
            rating: model.vote_average,
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
        popularity: model.popularity,
      });

      movie = await Movie.findOne({ id: newMovie.id });

      movie.images = await getMediaImages(movie.id, 'movie', model);
      movie.genres = await getGenres(model.genres, modelENG.genres);
      movie.countries = await getCountries(model.production_countries);
      movie.director = await getPeoples(
        model.credits,
        'director',
        movie.id,
        'movie',
      );
      movie.cast = await getPeoples(model.credits, 'actor', movie.id, 'movie');
      movie.tags = await getTags(model.keywords.keywords);
      movie.production_companies = await getProdCompanies(
        model.production_companies,
      );
      await movie.save();
      console.log(
        `Фильм c tmdbID:${movie.external_ids.tmdb} был добавлен в базу под id:${movie.id}`,
      );
      logEvents(
        `ACTION:Добавлен в базу  ---  WastedId:${movie.id} - tmdbID:${movie.external_ids.tmdb} - Title:${movie.title} `,
        'movieDBLog.log',
      );
      return;
    }

    console.log(
      `Фильм c tmdbID:${movie.external_ids.tmdb} уже существует в базе данных под id:${movie.id}`,
    );
    logEvents(
      `ACTION:Уже существует  ---  WastedId:${movie.id} - tmdbID:${movie.external_ids.tmdb} - Title:${movie.title} `,
      'movieDBLog.log',
    );
  }
}
export default new MovieService();

// export async function getCountries(countries) {
//   const newCountries = [];
//   // let i = 0;
//   for (const country of countries) {
//     let newCountry = await Country.findOne({ short_name: country.iso_3166_1 });
//     if (!newCountry) {
//       newCountry = await Country.create({
//         short_name: country.iso_3166_1,
//         name: country.name,
//       });
//     }
//     //console.log(`Country: `, i++);
//     newCountries.push(newCountry._id);
//   }
//   return newCountries;
// }

// export async function getGenres(genres, genresENG) {
//   const newGenres = [];
//   for (let i = 0; i < genres.length; i++) {
//     let genre = await Genre.findOne({ ru: genres[i].name });
//     if (!genre) {
//       genre = await Genre.create({
//         ru: genres[i].name,
//         en: genresENG[i].name,
//       });
//     }
//     //console.log(`Genre: ${i} из ${genres.length}`);
//     newGenres.push(genre._id);
//   }
//   return newGenres;
// }

// export async function getMediaImages(id, mediaType, model) {
//   const images = {
//     poster_url: {
//       ru: await createImgUrl(id, mediaType, model.poster_path),
//       en: await createImgUrl(
//         id,
//         mediaType,
//         getImgPath(model.images.posters, 'en'),
//       ),
//     },
//     logo_url: {
//       ru: await createImgUrl(
//         id,
//         mediaType,
//         getImgPath(model.images.logos, 'ru'),
//       ),
//       en: await createImgUrl(
//         id,
//         mediaType,
//         getImgPath(model.images.logos, 'en'),
//       ),
//     },
//     backdrop_url: await createImgUrl(id, mediaType, model.backdrop_path),
//   };
//   return images;
// }

// export async function getPeoples(credits, type, id, mediaType) {
//   const newPeoples = [];
//   let i = 1;
//   switch (type) {
//     case 'director':
//       for (const people of credits.crew) {
//         if (people.job === 'Director') {
//           newPeoples.push(await addPeople(people, id, mediaType));
//         }
//         console.log(`Director: ${i++} из ${credits.crew.length}`);
//       }

//       return newPeoples;
//     case 'actor':
//       for (const people of credits.cast) {
//         newPeoples.push(await addPeople(people, id, mediaType));
//         console.log(`Cast: ${i++} из ${credits.cast.length}`);
//       }

//       return newPeoples;
//   }
// }
// async function addPeople(people, id, mediaType) {
//   let newPeople = await People.findOne({ name: people.name });
//   if (!newPeople) {
//     await People.create({
//       name: people.name,
//     });
//     newPeople = await People.findOne({ name: people.name });
//     newPeople.profile_img = await createImgUrl(
//       newPeople.id,
//       'people',
//       people.profile_path,
//     );

//     if (mediaType === 'movie') {
//       const movie = { movie_id: id, role: people.character, job: people.job };
//       newPeople.movies = [...newPeople.movies, movie];
//     }
//     if (mediaType === 'show') {
//       const show = { show_id: id, role: people.character, job: people.job };
//       newPeople.shows = [...newPeople.shows, show];
//     }
//     await newPeople.save();
//   }
//   return { person: newPeople._id, role: people.character };
// }

// export async function getTags(tags) {
//   const newTags = [];
//   // let i = 0;
//   for (const tag of tags) {
//     let newTag = await Tag.findOne({ en: tag.name });
//     if (!newTag) {
//       newTag = await Tag.create({
//         ru: await translate(tag.name, 'ru'),
//         en: tag.name,
//       });
//     }
//     //console.log('Tag: ', i++);
//     newTags.push(newTag._id);
//   }
//   return newTags;
// }

// export async function getProdCompanies(companies) {
//   const newCompanies = [];
//   // let i = 0;
//   for (const company of companies) {
//     let newCompany = await ProdCompany.findOne({ name: company.name });
//     if (!newCompany) {
//       await ProdCompany.create({
//         name: company.name,
//       });
//       newCompany = await ProdCompany.findOne({ name: company.name });
//       newCompany.logo_url = await createImgUrl(
//         newCompany.id,
//         'company',
//         company.logo_path,
//       );
//       await newCompany.save();
//     }
//     //console.log('Company: ', i++);
//     newCompanies.push(newCompany._id);
//   }
//   return newCompanies;
// }
