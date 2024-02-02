export class MovieDto {
  constructor(model) {
    this.id = model.id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.images = model.images;
    this.release_date = model.release_date.toLocaleDateString('ru-RU');
    this.genres = model.genres;
    this.countries = model.countries;
    this.director = model.director;
    this.cast = model.cast;
    this.watch_count = model.watch_count;
    this.description = model.description;
    this.description_original = model.description_original;
    this.tags = model.tags;
    this.duration = model.duration;
    this.production_companies = model.production_companies;
    this.reactions = model.reactions;
    this.ratings = model.ratings;
    this.external_ids = model.external_ids;
    this.user_raitings = model.user_raitings;
    this.comments = model.comments;
  }
}

export class MovieShortDto {
  constructor(model) {
    this.id = model.id;
    this.title = model.title;
    this.title_original = model.title_original;
    this.images = model.images;
    this.release_date = model.release_date;
    this.genres = model.genres;
    this.countries = model.countries;
    this.director = model.director;
    this.description = model.description;
    this.description_original = model.description_original;
    this.duration = model.duration;
    this.ratings = model.ratings;
  }
}
