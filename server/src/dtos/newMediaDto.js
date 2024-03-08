import { formatISO } from 'date-fns';

export class NewMediaDto {
  constructor(model) {
    this.id = model.id;
    this._id = model._id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.images = model.images.poster_url;
    this.release_date = formatISO(
      new Date(model.release_date || model.start_date),
      { representation: 'date' },
    );
    this.rating = model.rating;
    this.type = model.type;
    this.genres = model.genresId;
    this.watch_count = model.watch_count;
    this.popularity = model.popularity;
    this.countries = model.countriesId;
    this.platforms = model.platformsId;
  }
}
