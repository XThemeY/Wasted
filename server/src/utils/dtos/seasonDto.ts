import type { Types } from 'mongoose';
import type { IEpisodeShort, ISeason, ISeasonShort } from '#interfaces/IApp';
import type { IReactions } from '#interfaces/IFields';
import type {
  ICommentsMediaModel,
  IEpisodeModel,
  ISeasonModel,
} from '#interfaces/IModel';
import { format } from 'date-fns';
import { EpisodeShort } from './episodeDto';

export class SeasonFull implements ISeason {
  id: number;
  show_id: number;
  season_number: number;
  episode_count: number;
  air_date: string;
  episodes: IEpisodeShort[];
  title: string;
  title_original: string;
  description: string;
  description_original: string;
  poster_url: string;
  rating: number;
  reactions: IReactions;
  comments: Types.ObjectId | ICommentsMediaModel;
  commentsCount: number;
  constructor(model: ISeasonModel) {
    this.id = model.id;
    this.show_id = model.show_id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.poster_url = model.poster_url;
    this.air_date = format(new Date(model.air_date), 'dd.MM.yyyy');
    this.season_number = model.season_number;
    this.episode_count = model.episode_count;
    this.description = model.description;
    this.description_original = model.description_original;
    this.reactions = model.reactions;
    this.rating = model.rating;
    this.episodes = getEpisodes(model.episodes);
    this.comments = model.comments;
    this.commentsCount = model.commentsCount;
  }
}

export class SeasonShort implements ISeasonShort {
  id: number;
  show_id: number;
  title: string;
  title_original: string;
  air_date: Date | string;
  season_number: number;
  episode_count: number;
  episodes: IEpisodeShort[];
  commentsCount: number;
  constructor(model: ISeasonModel) {
    this.id = model.id;
    this.show_id = model.show_id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.air_date = format(new Date(model.air_date), 'dd.MM.yyyy');
    this.season_number = model.season_number;
    this.episode_count = model.episode_count;
    this.episodes = getEpisodes(model.episodes);
    this.commentsCount = model.commentsCount;
  }
}

function getEpisodes(episodes: IEpisodeModel[]): IEpisodeShort[] {
  return episodes.map((item) => {
    return new EpisodeShort(item);
  });
}
