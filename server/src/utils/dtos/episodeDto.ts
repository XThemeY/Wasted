import type { IEpisode } from '#interfaces/IApp';
import type { IRatings, IReactions } from '#interfaces/IFields';
import type { IEpisodeModel } from '#interfaces/IModel';
import { formatISO } from 'date-fns';
import { Types } from 'mongoose';

export class Episode implements IEpisode {
  show_id: number;
  poster_url: string;
  episode_type: string;
  season_number: number;
  episode_number: number;
  air_date: string;
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

  constructor(model: IEpisodeModel) {
    this.id = model.id;
    this.show_id = model.show_id;
    this.episode_type = model.episode_type;
    this.season_number = model.season_number;
    this.episode_number = model.episode_number;
    this.poster_url = model.poster_url;
    this.title = model.title;
    this.title_original = model.title_original;
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
