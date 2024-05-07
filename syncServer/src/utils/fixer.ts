import 'dotenv/config';
import {
  Movie,
  TVShow,
  Episode,
  Season,
  People,
  CommentsMovie,
  CommentsShow,
  CommentsSeason,
  CommentsEpisode,
  CommentsPeople,
} from '#db/models/index.js';
import mongoose from 'mongoose';
import RequestHandler from '#api/ApiConfigs.js';
import MovieService from '#api/tmdb/v1/services/movieService.js';
import ShowService from '#api/tmdb/v1/services/showService.js';

(async function () {
  const DB_URL_TMDBMain =
    'mongodb://XTheme:39911009XT@192.168.0.199:27017/wastedDB?authSource=admin&retryWrites=true&w=majority';
  // 'mongodb://WastedTest:wastedTest1993@127.0.0.1:27017/WastedTest?authSource=admin&retryWrites=true&w=majority';

  try {
    await mongoose.connect(DB_URL_TMDBMain);
    // const movies = await Movie.countDocuments();
    // const episodes = await Episode.countDocuments();
    // const shows = await TVShow.countDocuments();
    // const seasons = await Season.countDocuments();
    // const peoples = await People.countDocuments();

    // const peopleCount = (await People.countDocuments()) + 78;

    // for (let i = 79; i <= peopleCount; i++) {
    //   try {
    //     await People.findOneAndUpdate({ id: i }, { id: i - 78 });
    //     console.log(` ${i} из ${peopleCount + 77}`);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    // console.log('Show peoples synced');

    //1007143
    // const episodeComms = async () => {
    //   for (let i = 1; i <= episodes; i++) {
    //     try {
    //       await Episode.findOneAndUpdate(
    //         { id: i },
    //         {
    //           $set: {
    //             comments: (await CommentsEpisode.create({ media_id: i }))._id,
    //           },
    //         }
    //       );
    //       console.log(`Episode ${i} из ${episodes - 1} добавлен`);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // };

    //15799
    // const showComms = async () => {
    //   for (let i = 1; i <= shows; i++) {
    //     try {
    //       await TVShow.findOneAndUpdate(
    //         { id: i },
    //         {
    //           $set: {
    //             comments: (await CommentsShow.create({ media_id: i }))._id,
    //           },
    //         }
    //       );
    //       console.log(`Show ${i} из ${shows - 1} добавлен`);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // };

    //42203
    // const seasonComms = async () => {
    //   for (let i = 1; i <= seasons; i++) {
    //     try {
    //       await Season.findOneAndUpdate(
    //         { id: i },
    //         {
    //           $set: {
    //             comments: (await CommentsSeason.create({ media_id: i }))._id,
    //           },
    //         }
    //       );
    //       console.log(`Season ${i} из ${seasons - 1} добавлен`);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // };

    //649143
    // const movieComms = async () => {
    //   movies.forEach(async (movie) => {
    //     movie.comments = (
    //       await CommentsMovie.create({ media_id: movie.id })
    //     )._id;
    //     await movie.save();
    //     console.log(`Movie ${movie.id} из ${movies - 1} добавлен`);
    //   });
    // };

    //??
    // const peopleComms = async () => {
    //   for (let i = 1; i <= peoples ; i++) {
    //     try {
    //       await People.findOneAndUpdate(
    //         { id: i },
    //         {
    //           $set: {
    //             comments: (await CommentsPeople.create({ media_id: i }))._id,
    //           },
    //         }
    //       );
    //       console.log(`People ${i} из ${peoples - 1 } добавлен`);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // };

    // await showComms();
    // await seasonComms();
    // await episodeComms();
    // await movieComms();
    // await peopleComms();

    console.log('Комментарии добавлены');
  } catch (e) {
    console.log(e);
  }
})();
