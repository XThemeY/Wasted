import type { Types } from 'mongoose';
import type { IEpisodeShort, ISeason, ISeasonShort } from '#interfaces/IApp';
import type { IRatings, IReactions } from '#interfaces/IFields';
import type { ICommentsMediaModel, ISeasonModel } from '#interfaces/IModel';
import { formatISO } from 'date-fns';

export class SeasonFull implements ISeason {
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
  show_id: number;
  poster_url: string;
  season_number: number;
  episode_count: number;
  air_date: string;
  episodes: IEpisodeShort[];
  comments: Types.ObjectId | ICommentsMediaModel;
  constructor(model: ISeasonModel, episodes: IEpisodeShort[]) {
    this.id = model.id;
    this.show_id = model.show_id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.poster_url = model.poster_url;
    this.air_date = formatISO(new Date(model.air_date), {
      representation: 'date',
    });
    this.season_number = model.season_number;
    this.episode_count = model.episode_count;
    this.description = model.description;
    this.description_original = model.description_original;
    this.duration = model.duration;
    this.reactions = model.reactions;
    this.rating = model.rating;
    this.ratings = model.ratings;
    this.watch_count = model.watch_count;
    this.episodes = episodes;
    this.comments = model.comments;
  }
}

export class SeasonShort implements ISeasonShort {
  id: number;
  title: string;
  title_original: string;
  duration: number;
  show_id: number;
  season_number: number;
  episode_count: number;
  air_date: Date | string;
  episodes: IEpisodeShort[];
  commentsCount: number;
  constructor(model: ISeasonModel, episodes: IEpisodeShort[]) {
    this.id = model.id;
    this.show_id = model.show_id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.air_date = formatISO(new Date(model.air_date), {
      representation: 'date',
    });
    this.duration = model.duration;
    this.season_number = model.season_number;
    this.episode_count = model.episode_count;
    this.episodes = episodes;
    //this.commentsCount = ;
  }
}
