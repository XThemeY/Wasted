import type { MergeEpisode, MergeMovie } from '#types/types';

export class MovieRatingDto {
  id: number;
  user_rating: number;
  movie_rating: number;
  title: string;
  title_original: string;
  ratingName: string;
  image_url: string;
  constructor(model: MergeMovie) {
    this.id = model.id;
    this.title = model.movieDetails.title;
    this.title_original = model.movieDetails.title_original;
    this.image_url =
      model.movieDetails.images?.backdrop_url ||
      model.movieDetails.images?.poster_url.ru ||
      model.movieDetails.images?.poster_url.en;
    this.user_rating = model.rating;
    this.movie_rating = model.movieDetails.rating;
    this.ratingName = model.ratingName;
  }
}

export class EpisodeRatingDto {
  id: number;
  show_id: number;
  user_rating: number;
  episode_rating: number;
  title: string;
  title_original: string;
  title_show: string;
  title_show_original: string;
  ratingName: string;
  image_url: string;
  constructor(model: MergeEpisode) {
    this.id = model.id;
    this.show_id = model.episodeDetails.show?.id;
    this.title_show = model.episodeDetails.show?.title;
    this.title_show_original = model.episodeDetails.show?.title_original;
    this.title = model.episodeDetails.title;
    this.title_original = model.episodeDetails.title_original;
    this.image_url =
      model.episodeDetails?.poster_url ||
      model.episodeDetails.show?.images?.backdrop_url ||
      model.episodeDetails.show?.images?.poster_url.ru ||
      model.episodeDetails.show?.images?.poster_url.en;
    this.user_rating = model.rating;
    this.episode_rating = model.episodeDetails.rating;
    this.ratingName = model.ratingName;
  }
}
