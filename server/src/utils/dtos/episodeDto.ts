import { IReactions } from '#interfaces/IFields';
import { Types } from 'mongoose';

export class EpisodeDto {
  id: number;
  title: string;
  title_original: string;
  poster_url: string;
  air_date: Date;
  watch_count: number;
  description: string;
  description_original: string;
  duration: number;
  production_companies: number[];
  reactions: IReactions;
  tags: number[];
  rating: number;
  comments: Types.ObjectId;
  constructor(model) {
    this.id = model.id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.poster_url = model.poster_url;
    this.air_date = model.air_date.toLocaleDateString('ru-RU');
    this.watch_count = model.watch_count;
    this.description = model.description;
    this.description_original = model.description_original;
    this.duration = model.duration;
    this.production_companies = model.production_companies;
    this.reactions = model.reactions;
    this.tags = model.tagsId;
    this.rating = model.rating;
    this.comments = model.comments;
  }
}
