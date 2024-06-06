import type { IComment, IDelComment } from '#interfaces/IApp';
import type { IEpisodeModel, IMovieModel } from '#interfaces/IModel';

export type RatingTuple = [string, number];

export type ResponseMsg = {
  status: string;
  type: string;
  id: number;
  rating?: number;
  reactions?: string[];
  message: string;
};

export type Rating = {
  value: number;
  vote_count: number;
};

export type Comments = (IComment | IDelComment)[];

export type WastedRating = {
  beer: number;
  favorite: number;
  good: number;
  pokerface: number;
  poop: number;
  vote_count: number;
};

export type Ratings = { [key: string]: Rating | WastedRating };

export type Reaction = { value?: number; vote_count: number };

export type ReactionsConfig = { [key: string]: string };

export type Reactions = { [key: string]: Reaction };

export type RatingRes = {
  userRating: UserRating;
  totalRating:
    | number
    | { showRating: number; seasonRating?: number; episodeRating?: number };
};

export type ReactionRes = {
  userReactions: UserReaction;
  reactions: Reactions;
};

export type UserRating = {
  movieId?: number;
  showId?: number;
  episodeId?: number;
  seasonNumber?: number;
  rating: WastedRating;
};

export type UserReaction = {
  movieId?: number;
  showId?: number;
  episodeId?: number;
  seasonNumber?: number;
  reactions: string[];
};

export type ItemRating = {
  itemId: number;
  rating: number;
  ratingName: string;
};

export type WastedItem = {
  id: number;
  status?: string;
  watch_count: number;
  seasonNumber?: number;
  watchedAt?: Date;
  playedAt?: Date;
  playedCount?: number;
  watchedEpisodes?: WastedItem[];
};

export type MergeMovie = {
  id: number;
  rating: number;
  ratingName: string;
  movieDetails: IMovieModel;
};

export type MergeEpisode = {
  id: number;
  rating: number;
  ratingName: string;
  episodeDetails: IEpisodeModel;
};
