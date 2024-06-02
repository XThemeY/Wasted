import type { IUser, IUserPrivate } from '#interfaces/IApp';
import type {
  ISocialProfiles,
  IGameProfiles,
  ISettings,
} from '#interfaces/IFields';
import type {
  IFavoriteModel,
  IUserCommentReactionsModel,
  IUserModel,
  IUserRatingsModel,
  IUserReactionsModel,
  IWastedHistoryModel,
} from '#interfaces/IModel';
import { MovieShort } from './movieDto';

export class UserDto implements IUser {
  id: number;
  username: string;
  favorites: IFavoriteModel;
  ratings: IUserRatingsModel;
  reactions: IUserReactionsModel;
  wastedHistory: IWastedHistoryModel;
  commentReactions: IUserCommentReactionsModel;
  socialProfiles: ISocialProfiles;
  gameProfiles: IGameProfiles;
  favoriteMovies;
  constructor(model: IUserModel) {
    this.id = model.id;
    this.username = model.username;
    this.favoriteMovies = this.getFavMovies(model.favorites.favoriteMovies);
    this.favorites = model.favorites as IFavoriteModel;
    this.ratings = model.ratings as IUserRatingsModel;
    this.reactions = model.reactions as IUserReactionsModel;
    this.wastedHistory = model.wastedHistory as IWastedHistoryModel;
    this.commentReactions =
      model.commentReactions as IUserCommentReactionsModel;
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
  email: string;
  authentication: {
    password: string;
    activationLink: string;
    isActivated: boolean;
  };
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
    this.email = model.email;
    this.authentication = model.authentication;
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
