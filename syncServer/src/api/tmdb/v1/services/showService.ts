// import { TVShow, Season, Episode, People, Counters } from '#db/models/index.js';
// import {
//   getMediaImages,
//   getGenres,
//   getCountries,
//   getPeoples,
//   getTags,
//   getProdCompanies,
//   getPlatforms,
//   getSeasons,
// } from '#/utils/dbFields.js';

// class TVShowService {
//   async addShowToDb(model, modelENG, latestTMDBId) {
//     let show = await TVShow.findOne({ 'external_ids.tmdb': model.id });
//     if (!show) {
//       const newMovie = await TVShow.create({
//         title: model.name,
//         title_original: model.original_name,
//         start_date: model.first_air_date,
//         end_date: model.last_air_date,
//         description: model.overview,
//         description_original: modelENG.overview,
//         status: model.status,
//         episode_duration: model.episode_run_time[0],
//         number_of_seasons: model.number_of_seasons,
//         number_of_episodes: model.number_of_episodes,
//         rating: model.vote_average,
//         ratings: {
//           tmdb: {
//             rating: model.vote_average,
//             vote_count: model.vote_count,
//           },
//           //imdb: { type: Number, default: 0 },
//           //kinopoisk: { type: Number, default: 0 },
//         },
//         external_ids: {
//           tmdb: model.id,
//           imdb: model.external_ids.imdb_id,
//           //kinopoisk: { type: String },
//         },
//         popularity: model.popularity,
//       });

//       show = await TVShow.findOne({ id: newMovie.id });
//       show.images = await getMediaImages(show.id, 'show', model);
//       show.genres = await getGenres(model.genres, modelENG.genres);
//       show.countries = await getCountries(model.production_countries);
//       show.creators = await getPeoples(
//         model.created_by,
//         'creator',
//         show.id,
//         'show',
//       );
//       show.cast = await getPeoples(model.credits, 'actor', show.id, 'show');
//       show.tags = await getTags(model.keywords.results);
//       show.platforms = await getPlatforms(model.networks);
//       show.production_companies = await getProdCompanies(
//         model.production_companies,
//       );
//       show.seasons = await getSeasons(
//         show.id,
//         model.seasons,
//         modelENG.seasons,
//         model.id,
//       );
//       await show.save();
//       console.log(
//         `Шоу c tmdbID:${show.external_ids.tmdb} из ${latestTMDBId} был добавлен в базу под id:${show.id}`,
//       );
//       logEvents(
//         `ACTION:Добавлен в базу  ---  WastedId:${show.id} - tmdbID:${show.external_ids.tmdb} - Title:${show.title} `,
//         'showDBLog.log',
//       );
//       return;
//     }

//     console.log(
//       `Шоу c tmdbID:${show.external_ids.tmdb} уже существует в базе данных под id:${show.id}`,
//     );
//     logEvents(
//       `ACTION:Уже существует  ---  WastedId:${show.id} - tmdbID:${show.external_ids.tmdb} - Title:${show.title} `,
//       'showDBLog.log',
//     );
//   }

//   // async delShowFromDb(show_id) {
//   //   await People.updateMany(
//   //     { 'shows.id': show_id },
//   //     { $pull: { shows: { id: show_id } } },
//   //   );
//   //   const episodes = await Episode.deleteMany({ show_id });
//   //   console.log('Episodes deleteCount', episodes.deletedCount);
//   //   await Counters.findOneAndUpdate(
//   //     { _id: 'episodeid' },
//   //     { $inc: { seq: -episodes.deletedCount } },
//   //   );
//   //   const seasons = await Season.deleteMany({ show_id });
//   //   console.log('Seasons deleteCount', seasons.deletedCount);
//   //   await Counters.findOneAndUpdate(
//   //     { _id: 'seasonid' },
//   //     { $inc: { seq: -seasons.deletedCount } },
//   //   );
//   //   const show = await TVShow.findOneAndDelete({ id: show_id });
//   //   if (!show) {
//   //     console.log(`Шоу c id:${show_id} не существует в базе данных`);
//   //     return;
//   //   }
//   //   await Counters.findOneAndUpdate({ _id: 'tvshowid' }, { $inc: { seq: -1 } });
//   //   console.log(
//   //     `Шоу c tmdbID:${show.external_ids.tmdb} и id:${show.id} был удален из базы данных`,
//   //   );
//   //   logEvents(
//   //     `ACTION:Удален  ---  WastedId:${show.id} - tmdbID:${show.external_ids.tmdb} - Title:${show.title} `,
//   //     'showDBLog.log',
//   //   );
//   // }
// }
// export default new TVShowService();
