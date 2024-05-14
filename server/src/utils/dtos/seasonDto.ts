import type { Types } from 'mongoose';
import type { ISeason, IEpisode } from '#interfaces/IApp';
import type { IRatings, IReactions } from '#interfaces/IFields';
import type { ISeasonModel } from '#interfaces/IModel';
import { formatISO } from 'date-fns';

export class Season implements ISeason {
  id: number;
  title: string;
  title_original: string;
  watch_count: number;
  description: string;
  description_original: string;
  duration: number;
  rating: number;
  ratings: IRatings;
  reactions: IReactions;
  comments: Types.ObjectId;
  show_id: number;
  poster_url: string;
  season_number: number;
  episode_count: number;
  air_date: Date | string;
  episodes: IEpisode[];

  constructor(model: ISeasonModel) {
    this.id = model.id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.poster_url = model.poster_url;
    this.air_date = formatISO(new Date(model.air_date), {
      representation: 'date',
    });
    this.description = model.description;
    this.description_original = model.description_original;
    this.duration = model.duration;
    this.reactions = model.reactions;
    this.rating = model.rating;
    this.ratings = model.ratings;
    this.watch_count = model.watch_count;
    this.comments = model.comments;
  }
}
