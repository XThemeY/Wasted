import type { IPersonJob } from '#interfaces/IFields';
import type { IPeopleModel } from '#interfaces/IModel';
import type { Types } from 'mongoose';

export class Person {
  id: number;
  original_name: string;
  translations: {
    ru: string;
    en: string;
  };
  profile_img: string;
  movies: IPersonJob[];
  shows: IPersonJob[];
  tmdb_id: number;
  comments: Types.ObjectId;

  constructor(model: IPeopleModel) {
    this.id = model.id;
    this.original_name = model.original_name;
    this.translations = model.translations;
    this.profile_img = model.profile_img;
    this.movies = model.movies;
    this.shows = model.shows;
    this.comments = model.comments;
  }
}
