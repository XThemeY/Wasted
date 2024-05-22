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

export type Ratings = { [key: string]: Rating };

export type Reaction = { value: number; vote_count: number };

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
  rating: Rating;
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
  itemId: number;
  status?: string;
  watch_count: number;
  watchedAt?: Date;
  playedAt?: Date;
  playedCount?: number;
  watchedEpisodes?: WastedItem[];
};
