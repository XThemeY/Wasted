import {
  Movie,
  TVShow,
  Episode,
  Season,
  People,
  CommentsMovie,
  CommentsShow,
  CommentsSeason,
  CommentsPeople,
} from '#db/models/index.js';
import mongoose from 'mongoose';

(async function () {
  const DB_URL_TMDBMain =
    'mongodb://XTheme:39911009XT@192.168.0.199:27017/wastedDB?authSource=admin&retryWrites=true&w=majority';

  try {
    await mongoose.connect(DB_URL_TMDBMain);
    // const movies = await Movie.find({});
    // const episodes = await Episode.find({});
    // const seasons = await TVShow.find({});
    // const seasons = await Season.find({});
    // const peoples = await People.find({});

    await TVShow.updateMany({}, { $unset: { comments: 1 } });
    await Episode.updateMany({}, { $unset: { comments: 1 } });
    await Season.updateMany({}, { $unset: { comments: 1 } });
    await People.updateMany({}, { $unset: { comments: 1 } });
    await Movie.updateMany({}, { $unset: { comments: 1 } });

    const seasonComms = async () => {
      seasons.forEach(async (season) => {
        delete season.comments;
        console.log(`Season ${season.id} from ${seasons.length} deleted`);
      });
    };

    const peopleComms = async () => {
      peoples.forEach(async (people) => {
        delete people.comments;
        console.log(`People ${people.id} from ${peoples.length} deleted`);
      });
    };

    const episodeComms = async () => {
      episodes.forEach(async (episode) => {
        delete episode.comments;
        console.log(`Episode ${episode.id} from ${episodes.length} deleted`);
      });
    };

    // const movieComms = async () => {
    //   movies.forEach(async (movie) => {
    //     movie.comments = (
    //       await CommentsMovie.create({ media_id: movie.id })
    //     )._id;
    //     await movie.save();
    //     console.log(`Movie ${movie.id} из ${movies.length} добавлен`);
    //   });
    // };

    // const episodeComms = async () => {
    //   episodes.forEach(async (episode) => {
    //     episode.comments = (
    //       await CommentsEpisode.create({ media_id: episode.id })
    //     )._id;
    //     await episode.save();
    //     console.log(`Episode ${episode.id} из ${episodes.length} добавлен`);
    //   });
    // };

    // const showComms = async () => {
    //   shows.forEach(async (show) => {
    //     show.comments = (await CommentsShow.create({ media_id: show.id }))._id;
    //     await show.save();
    //     console.log(`Show ${show.id} из ${shows.length} добавлен`);
    //   });
    // };

    // const seasonComms = async () => {
    //   seasons.forEach(async (season) => {
    //     season.comments = (
    //       await CommentsSeason.create({ media_id: season.id })
    //     )._id;
    //     await season.save();
    //     console.log(`Season ${season.id} из ${seasons.length} добавлен`);
    //   });
    // };

    // const peopleComms = async () => {
    //   peoples.forEach(async (person) => {
    //     person.comments = (
    //       await CommentsPeople.create({ media_id: person.id })
    //     )._id;
    //     await person.save();
    //     console.log(`Person ${person.id} из ${peoples.length} добавлен`);
    //   });
    // };

    //await showComms();
    // await movieComms();
    // await episodeComms();
    // await seasonComms();
    // await peopleComms();

    console.log('Комментарии добавлены');
  } catch (e) {
    console.log(e);
  }
})();
