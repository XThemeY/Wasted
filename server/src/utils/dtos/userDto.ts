import { EpisodeSuperShort } from './episodeDto';
import { ShowSuperShort } from './showDto';
import { MovieShort, MovieSuperShort } from './movieDto';
import type {
  IProfileFavorite,
  IProfileRatings,
  IUser,
  IUserPrivate,
} from '#interfaces/IApp';
import type {
  ISocialProfiles,
  IGameProfiles,
  ISettings,
} from '#interfaces/IFields';
import type {
  ICommentsMediaModel,
  IFavoriteModel,
  IUserCommentReactionsModel,
  IUserModel,
  IUserRatingsModel,
  IUserReactionsModel,
  IWastedHistoryModel,
  IEpisodeModel,
  IMovieModel,
  IShowModel,
} from '#interfaces/IModel';
import { format } from 'date-fns';
import { EpisodeRatingDto, MovieRatingDto } from './userRatingDto';
import type { MergeEpisode, MergeMovie } from '#types/types';

export class UserDto implements IUser {
  id: number;
  username: string;
  avatar_url: string;
  birthdate: string;
  gender: string;
  country: string;
  userRoles: string[];
  refreshToken?: string;
  accessToken: string;
  activationLink?: string;
  favorites: IProfileFavorite;
  ratings: IProfileRatings;
  wastedHistory: IWastedHistoryModel;
  socialProfiles: ISocialProfiles;
  gameProfiles: IGameProfiles;
  comments: ICommentsMediaModel;
  createdAt: string;
  reactions: IUserReactionsModel;
  commentReactions: IUserCommentReactionsModel;
  user;
  constructor(model: IUserModel) {
    this.id = model.id;
    this.username = model.username;
    // this.favorites = {
    //   movie_count: model.favorites.movies.length,
    //   show_count: model.favorites.tvShows.shows.length,
    //   episodes_count: model.favorites.tvShows.episodes.length,
    // };
    // new ProfileFav(
    //   model.favorites.favoriteMovies,
    //   model.favorites.favoriteShows,
    // );
    // this.ratings = new ProfileRating(
    //   model.ratings.mergeMovies,
    //   model.ratings.mergeEpisodes,
    // );
    this.accessToken = model.accessToken;
    this.refreshToken = model.refreshToken;
    this.user = model.user;
    this.userRoles = model.settings.userRoles;
    // this.reactions = model.reactions as IUserReactionsModel;
    // this.wastedHistory = model.wastedHistory as IWastedHistoryModel;
    // this.commentReactions =
    //   model.commentReactions as IUserCommentReactionsModel;
    // this.socialProfiles = model.socialProfiles;
    // this.gameProfiles = model.gameProfiles;
    // this.createdAt = format(new Date(model.createdAt), 'yyyy.MM.dd');
  }
}

export class SettingsDto implements IUser {
  id: number;
  username: string;
  favorites: IFavoriteModel;
  ratings: IUserRatingsModel;
  // reactions: IUserReactionsModel;
  wastedHistory: IWastedHistoryModel;
  // commentReactions: IUserCommentReactionsModel;
  socialProfiles: ISocialProfiles;
  gameProfiles: IGameProfiles;
  favoriteMovies;
  constructor(model: IUserModel) {
    this.id = model.id;
    this.username = model.username;
    this.favoriteMovies = this.getFavMovies(model.favorites.favoriteMovies);
    this.favorites = model.favorites as IFavoriteModel;
    this.ratings = model.ratings as IUserRatingsModel;
    this.wastedHistory = model.wastedHistory as IWastedHistoryModel;
    this.socialProfiles = model.socialProfiles;
    this.gameProfiles = model.gameProfiles;
  }

  getFavMovies(movies) {
    console.log('movies', movies);

    return movies.map((item) => {
      return new MovieShort(item);
    });
  }
}

export class UserPrivateDto implements IUserPrivate {
  id: number;
  username: string;
  favorites: IFavoriteModel;
  ratings: IUserRatingsModel;
  reactions: IUserReactionsModel;
  wastedHistory: IWastedHistoryModel;
  commentReactions: IUserCommentReactionsModel;
  socialProfiles: ISocialProfiles;
  gameProfiles: IGameProfiles;
  settings: ISettings;
  favoriteMovies;
  constructor(model: IUserModel) {
    this.id = model.id;
    this.username = model.username;
    this.favorites = model.favorites as IFavoriteModel;
    this.ratings = model.ratings as IUserRatingsModel;
    this.reactions = model.reactions as IUserReactionsModel;
    this.wastedHistory = model.wastedHistory as IWastedHistoryModel;
    this.commentReactions =
      model.commentReactions as IUserCommentReactionsModel;
    this.socialProfiles = model.socialProfiles;
    this.gameProfiles = model.gameProfiles;
    this.settings = model.settings;
  }
}

class ProfileFav implements IProfileFavorite {
  movies: MovieSuperShort[];
  tvShows: { shows: ShowSuperShort[]; episodes: EpisodeSuperShort[] } = {
    shows: [],
    episodes: [],
  };
  //games: GameSuperShort[];
  constructor(
    movieFavs: IMovieModel[],
    showFavs: { shows: IShowModel[]; episodes: IEpisodeModel[] },
  ) {
    this.movies = movieFavs?.map((item) => {
      return new MovieSuperShort(item);
    });
    this.tvShows.shows =
      showFavs.shows?.map((item) => {
        return new ShowSuperShort(item);
      }) || [];
    this.tvShows.episodes =
      showFavs.episodes?.map((item) => {
        return new EpisodeSuperShort(item);
      }) || [];
    //this.games = [];
  }
}

class ProfileRating implements IProfileRatings {
  movies: MovieRatingDto[];
  tvShows: { episodes: EpisodeRatingDto[] } = {
    episodes: [],
  };
  //games: GameSuperShort[];
  constructor(movies: MergeMovie[], episodes: MergeEpisode[]) {
    this.movies = movies?.map((item) => {
      return new MovieRatingDto(item);
    });
    this.tvShows.episodes =
      episodes?.map((item) => {
        return new EpisodeRatingDto(item);
      }) || [];
    //this.games = [];
  }
}
