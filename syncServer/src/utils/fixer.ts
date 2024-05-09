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

  //     'mongodb://WastedTest:wastedTest1993@127.0.0.1:27017/WastedTest?authSource=admin&retryWrites=true&w=majority';
  // 'mongodb://XTheme:39911009XT@192.168.0.199:27017/wastedDB?authSource=admin&retryWrites=true&w=majority';

  try {
    await mongoose.connect(DB_URL_TMDBMain);

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

    const movies = await Movie.countDocuments();
    for (let i = 443342; i <= movies; i++) {
      try {
        const movieId = +(
          await Movie.findOne({ id: i }, { external_ids: { tmdb: 1 } })
        ).external_ids.tmdb;
        const response = await RequestHandler.reqPeoples('movie', movieId);
        await MovieService.syncPeoples(response.data);
        console.log(` ${i} из ${movies}`);
      } catch (error) {
        console.log(error);
      }
    }

    console.log('Комментарии добавлены');
  } catch (e) {
    console.log(e);
  }
})();
