import { User } from '#db/models/index.js';
import type { IUserModel } from '#interfaces/IModel';
import ApiError from '#utils/apiError';
import { UserSettingsDto } from '#utils/dtos/index.js';

class UserService {
  async getUser(username: string): Promise<IUserModel> {
    const user = await User.findOne({ username })
      .populate({
        path: 'favorites',
        // populate: {
        //   path: 'favoriteMovies',
        //   select: 'id title title_original images duration rating',
        // },
      })
      // .populate({
      //   path: 'favorites',
      //   populate: {
      //     path: 'favoriteShows.shows',
      //     select:
      //       'id title title_original images status total_episodes_time episode_duration number_of_seasons number_of_episodes image rating',
      //   },
      // })
      // .populate({
      //   path: 'favorites',
      //   populate: {
      //     path: 'favoriteShows.episodes',
      //     select:
      //       'show_id id episode_title season_number episode_number poster_url',
      //     populate: {
      //       path: 'show',
      //       select: 'title title_original images',
      //     },
      //   },
      // })
      // .populate({
      //   path: 'ratings',
      //   populate: {
      //     path: 'ratingsMovies',
      //     select: 'id title title_original images rating ratingName',
      //   },
      // })
      // .populate({
      //   path: 'ratings',
      //   populate: {
      //     path: 'ratingsShows.tvShows.episodes',
      //     select:
      //       'show_id id title title_original season_number episode_number poster_url rating ratingName',
      //     populate: {
      //       path: 'show',
      //       select: 'title title_original images',
      //     },
      //   },
      // })
      .exec();

    if (!user)
      throw ApiError.BadRequest(
        `Пользователь с таким username:${username} не существует`,
      );

    // const mergeMovies = user.ratings.movies.map((movie) => {
    //   const movieDetails = user.ratings.ratingsMovies.find(
    //     (el) => el.id === movie.itemId,
    //   );
    //   return {
    //     id: movie.itemId,
    //     rating: movie.rating,
    //     ratingName: movie.ratingName,
    //     movieDetails,
    //   };
    // });
    // user.ratings.mergeMovies = mergeMovies;

    // const mergeEpisodes = user.ratings.tvShows.episodes.map((episode) => {
    //   const episodeDetails = user.ratings.ratingsShows.tvShows.episodes.find(
    //     (el) => el.id === episode.itemId,
    //   );
    //   return {
    //     id: episode.itemId,
    //     rating: episode.rating,
    //     ratingName: episode.ratingName,
    //     episodeDetails,
    //   };
    // });
    // user.ratings.mergeEpisodes = mergeEpisodes;

    return user;
  }

  async getAllUsers(params = {}) {
    const searchParams = { ...params };
    const users = await User.find(searchParams, '-authentication')
      .populate('roles')
      .populate('wastedhistory.movies')
      .populate('wastedhistory.tvShows')
      .exec();

    const totalCount = await User.find(searchParams).count().exec();
    const response = { users, total_users: totalCount };
    return response;
  }

  async getUserSettings(username) {
    const user = await User.findOne(
      { username },
      'username email socialProfiles gameProfiles settings',
    ).exec();
    return user;
  }

  async setUserSettings(username, body) {
    const settings = await User.findOneAndUpdate(
      { username },
      { ...body },
      {
        new: true,
        runValidators: true,
      },
    ).exec();

    const newSettings = new UserSettingsDto(settings);
    return newSettings;
  }
}

export default new UserService();
