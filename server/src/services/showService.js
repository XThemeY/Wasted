import { TVShow } from '../db/models/index.js';

class TVShowService {
  async addTVShowToDb(model, modelENG) {
    const newTVShow = await TVShow.create({
      title: model.title,
      title_original: model.original_title,
      release_date: model.release_date,
      description: model.overview,
      description_original: modelENG.overview,
      duration: model.runtime,
      ratings: {
        tmdb: {
          raiting: model.vote_average,
          vote_count: model.vote_count,
        },
        //imdb: { type: Number, default: 0 },
        //kinopoisk: { type: Number, default: 0 },
      },
      external_ids: {
        tmdb: model.id,
        imdb: model.imdb_id,
        //kinopoisk: { type: String },
      },
    });

    const show = await TVShow.findOne({ id: newTVShow.id });

    show.images = await getMediaImages(show.id, 'show', model);
    show.genres = await getGenres(model.genres, modelENG.genres);
    show.countries = await getCountries(model.production_countries);
    show.director = await getPeoples(
      model.credits,
      'director',
      show._id,
      'show',
    );
    show.cast = await getPeoples(model.credits, 'actor', show._id, 'show');
    show.tags = await getTags(model.keywords.keywords);
    show.production_companies = await getProdCompanies(
      model.production_companies,
    );
    await show.save();
    console.log('ID шоу: ', show.id);
  }
}
export default new TVShowService();
