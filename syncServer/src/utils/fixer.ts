// import 'dotenv/config';
// import {
//   Movie,
//   TVShow,
//   Episode,
//   Season,
//   People,
//   CommentsMovie,
//   CommentsShow,
//   CommentsSeason,
//   CommentsEpisode,
//   CommentsPeople,
// } from '#db/models/index.js';
// import mongoose from 'mongoose';
// import RequestHandler from '#api/ApiConfigs.js';
// import MovieService from '#api/tmdb/v1/services/movieService.js';
// import ShowService from '#api/tmdb/v1/services/showService.js';

// (async function () {
//   const DB_URL_TMDBMain =
//     'mongodb://XTheme:39911009XT@192.168.0.104:27017/wastedDB?authSource=admin&retryWrites=true&w=majority';
// 'mongodb://WastedTest:wastedTest1993@127.0.0.1:27017/WastedTest?authSource=admin&retryWrites=true&w=majority';
// 'mongodb://XTheme:39911009XT@192.168.0.199:27017/wastedDB?authSource=admin&retryWrites=true&w=majority';

//   try {
//     await mongoose.connect(DB_URL_TMDBMain);

// const showsCount = await TVShow.countDocuments();
// const moviesCount = await Movie.countDocuments();

// for (let i = 1; i <= showsCount; i++) {
//   const show = await TVShow.findOne({ id: i });
//   if (!show.genres.length) {
//     show.genres.push(0);
//   }
//   if (!show.platforms.length) {
//     show.platforms.push(0);
//   }
//   if (!show.countries.length) {
//     show.countries.push(0);
//   }
//   if (!show.production_companies.length) {
//     show.production_companies.push(0);
//   }
//   await show.save();
//   await TVShow.updateOne(
//     { id: i },
//     { $set: { 'external_ids.tmdb': Number(show.external_ids.tmdb) } },
//   );
//   console.log(`${i} из ${showsCount}`);
// }

// for (let i = 1; i <= moviesCount; i++) {
//   const movie = await Movie.findOne({ id: i });
//   if (!movie.genres.length) {
//     movie.genres.push(0);
//   }
//   if (!movie.countries.length) {
//     movie.countries.push(0);
//   }
//   if (!movie.production_companies.length) {
//     movie.production_companies.push(0);
//   }
//   await movie.save();
//   await Movie.updateOne(
//     { id: i },
//     { $set: { 'external_ids.tmdb': Number(movie.external_ids.tmdb) } },
//   );
//   console.log(`${i} из ${moviesCount}`);
// }

// for (let i = 1; i <= 1029013; i++) {
//   const movie = await Movie.findOne({ id: i });
//   if (!movie.genres.length) {
//     movie.genres.push(0);
//   }
//   if (!movie.countries.length) {
//     movie.countries.push(0);
//   }
//   if (!movie.production_companies.length) {
//     movie.production_companies.push(0);
//   }
//   await movie.save();
//   console.log(`${i} из 1029013`);
// }

// async function clean(showIds) {
//   for (const showId of showIds) {
//     try {
//       const response = await RequestHandler.reqMedia('tv', showId);
//       const responseENG = await RequestHandler.reqMedia(
//         'tv',
//         showId,
//         true,
//         false,
//       );
//       await ShowService.syncShow(response.data, responseENG.data, true);
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

// const peoples = await People.countDocuments();

// for (let i = 1113699; i <= peoples; i++) {
//   try {
//     await People.findOneAndUpdate(
//       { id: i },
//       {
//         $set: {
//           comments: (await CommentsPeople.create({ media_id: i }))._id,
//         },
//       },
//     );
//     console.log(`People ${i} из ${peoples} добавлен`);
//   } catch (error) {
//     console.log(error);
//   }
// }

// for (let i = 1; i <= 15801; i++) {
//   const show = await TVShow.findOne(
//     { id: i },
//     'number_of_episodes seasons',
//   ).populate({
//     path: 'seasons',
//     select: 'season_number episodes',
//     populate: {
//       path: 'episodes',
//       model: 'Episode',
//       select: 'duration',
//     },
//   });
//   const seasons = show.seasons;
//   let total_duration = 0;
//   for (const element of seasons) {
//     const episodes = element.episodes;
//     if (element.season_number >= 1) {
//       const season_duration = episodes.reduce(
//         (sum, item) => sum + item.duration,
//         0,
//       );
//       total_duration += season_duration;
//     }
//   }
//   const episode_duration = Math.trunc(
//     total_duration / show.number_of_episodes,
//   );

//   show.episode_duration = episode_duration || 0;
//   show.total_episodes_time = total_duration || 0;
//   await show.save();
//   console.log(`${i} из 15796`);
// }

// const movies = await Movie.countDocuments();
// for (let i = 443342; i <= movies; i++) {
//   try {
//     const movieId = +(
//       await Movie.findOne({ id: i }, { external_ids: { tmdb: 1 } })
//     ).external_ids.tmdb;
//     const response = await RequestHandler.reqPeoples('movie', movieId);
//     await MovieService.syncPeoples(response.data);
//     console.log(` ${i} из ${movies}`);
//   } catch (error) {
//     console.log(error);
//   }
// }

//     console.log('Комментарии добавлены');
//   } catch (e) {
//     console.log(e);
//   }
// })();
