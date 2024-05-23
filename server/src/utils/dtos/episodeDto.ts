import type { IEpisode, IEpisodeShort } from '#interfaces/IApp';
import type { IRatings, IReactions } from '#interfaces/IFields';
import type { ICommentsMediaModel, IEpisodeModel } from '#interfaces/IModel';
import { format } from 'date-fns';
import type { Types } from 'mongoose';

export class EpisodeFull implements IEpisode {
  id: number;
  show_id: number;
  season_number: number;
  episode_number: number;
  air_date: string;
  duration: number;
  watch_count: number;
  title: string;
  title_original: string;
  description: string;
  description_original: string;
  poster_url: string;
  episode_type: string;
  rating: number;
  ratings: IRatings;
  reactions: IReactions;
  comments: Types.ObjectId | ICommentsMediaModel;
  commentsCount: number;
  constructor(model: IEpisodeModel) {
    this.id = model.id;
    this.show_id = model.show_id;
    this.episode_type = model.episode_type;
    this.season_number = model.season_number;
    this.episode_number = model.episode_number;
    this.poster_url = model.poster_url;
    this.title = model.title;
    this.title_original = model.title_original;
    this.air_date = format(new Date(model.air_date), 'dd.MM.yyyy');
    this.description = model.description;
    this.description_original = model.description_original;
    this.duration = model.duration;
    this.reactions = model.reactions;
    this.rating = model.rating;
    this.ratings = model.ratings;
    this.watch_count = model.watch_count;
    this.comments = model.comments;
    this.commentsCount = model.commentsCount;
  }
}

export class EpisodeShort implements IEpisodeShort {
  id: number;
  show_id: number;
  title: string;
  title_original: string;
  episode_type: string;
  season_number: number;
  episode_number: number;
  duration: number;
  air_date: string;
  rating: number;
  commentsCount: number;
  constructor(model: IEpisodeModel) {
    this.id = model.id;
    this.show_id = model.show_id;
    this.episode_type = model.episode_type;
    this.season_number = model.season_number;
    this.episode_number = model.episode_number;
    this.duration = model.duration;
    this.title = model.title;
    this.title_original = model.title_original;
    this.air_date = format(new Date(model.air_date), 'dd.MM.yyyy');
    this.rating = model.rating;
    this.commentsCount = model.commentsCount;
  }
}
