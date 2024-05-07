import { TVShow } from '#db/models/index.js';
import {
  getMediaImages,
  getGenres,
  getCountries,
  getPeoples,
  getTags,
  getProdCompanies,
  getPlatforms,
  getSeasons,
} from '#utils/dbFields.js';
import type { IMediaModel, IShow } from '#interfaces/IModel.d.ts';
import { logger } from '#middleware/index.js';
import { logNames } from '#config/index.js';

const showLogger = logger(logNames.show).child({ module: 'ShowService' });

class TVShowService {
  async getShow(id: number): Promise<IShow | void> {
    const show = await TVShow.findOne({ 'external_ids.tmdb': id });
    if (!show) {
      showLogger.info(
        { tmdbID: id },
        `ACTION: Шоу c tmdbID:${id} не существует в базе данных`,
      );
      return;
    }
    showLogger.info(
      { tmdbID: +show.external_ids.tmdb, wastedId: show.id },
      `ACTION: Шоу c tmdbID:${show.external_ids.tmdb} уже существует в базе данных под id:${show.id}`,
    );
    return show;
  }

  async addShowToDb(
    model: IMediaModel,
    modelENG: IMediaModel,
    latestTMDBId?: number,
  ): Promise<void> {
    const oldShow = await TVShow.findOne({ 'external_ids.tmdb': model.id });

    if (!oldShow) {
      const show = await TVShow.create({
        title: model.name,
        title_original: model.original_name,
        start_date: model.first_air_date,
        end_date: model.last_air_date,
        description: model.overview,
        description_original: modelENG.overview,
        status: model.status,
        episode_duration: model.episode_run_time[0],
        number_of_seasons: model.number_of_seasons,
        number_of_episodes: model.number_of_episodes,
        rating: model.vote_average,
        ratings: {
          tmdb: {
            rating: model.vote_average,
            vote_count: model.vote_count,
          },
          //imdb: { type: Number, default: 0 },
          //kinopoisk: { type: Number, default: 0 },
        },
        external_ids: {
          tmdb: model.id,
          imdb: model.external_ids.imdb_id,
          //kinopoisk: { type: String },
        },
        popularity: model.popularity,
      });

      show.images = await getMediaImages(show.id, 'show', model);
      show.genres = await getGenres(model.genres, modelENG.genres);
      show.countries = await getCountries(model.production_countries);
      show.creators = await getPeoples(
        model.created_by,
        'creator',
        show.id,
        'show',
      );
      show.cast = await getPeoples(model.credits, 'actor', show.id, 'show');
      show.tags = await getTags(model.keywords.results);
      show.platforms = await getPlatforms(model.networks);
      show.production_companies = await getProdCompanies(
        model.production_companies,
      );
      show.seasons = await getSeasons(
        show.id,
        model.seasons,
        modelENG.seasons,
        model.id,
      );
      await show.save();
      showLogger.info(
        { tmdbID: +show.external_ids.tmdb, wastedId: show.id },
        `ACTION: Шоу c tmdbID:${show.external_ids.tmdb} из ${latestTMDBId || ''} был добавлен в базу под id:${show.id}.`,
      );
      return;
    }
    showLogger.info(
      { tmdbID: +oldShow.external_ids.tmdb, wastedId: oldShow.id },
      `Шоу c tmdbID:${oldShow.external_ids.tmdb} уже существует в базе данных под id:${oldShow.id}`,
    );
  }

  async syncPeoples(model: IMediaModel): Promise<void> {
    const show = await TVShow.findOne({ 'external_ids.tmdb': model.id });
    show.creators = await getPeoples(
      model.created_by,
      'creator',
      show.id,
      'show',
    );
    show.cast = await getPeoples(model.credits, 'actor', show.id, 'show');
    await show.save();
  }

  async syncShow(model: IMediaModel, modelENG: IMediaModel): Promise<void> {
    const show = await TVShow.findOne({ 'external_ids.tmdb': model.id });
    if (!show) {
      showLogger.info(
        { tmdbID: model.id },
        `ACTION: Шоу c tmdbID:${model.id} не существует в базе данных`,
      );
      return;
    }

    show.title = model.name;
    show.title_original = model.original_name;
    show.start_date = model.first_air_date;
    show.end_date = model.last_air_date;
    show.description = model.overview;
    show.description_original = modelENG.overview;
    show.status = model.status;
    show.episode_duration = model.episode_run_time[0];
    show.number_of_seasons = model.number_of_seasons;
    show.number_of_episodes = model.number_of_episodes;
    show.popularity = model.popularity;
    show.images = await getMediaImages(show.id, 'show', model);
    show.genres = await getGenres(model.genres, modelENG.genres);
    show.countries = await getCountries(model.production_countries);
    show.creators = await getPeoples(
      model.created_by,
      'creator',
      show.id,
      'show',
    );
    show.cast = await getPeoples(model.credits, 'actor', show.id, 'show');
    show.tags = await getTags(model.keywords.results);
    show.platforms = await getPlatforms(model.networks);
    show.production_companies = await getProdCompanies(
      model.production_companies,
    );
    show.seasons = await getSeasons(
      show.id,
      model.seasons,
      modelENG.seasons,
      model.id,
    );
    show.updatedAt = new Date();
    await show.save();
    showLogger.info(
      { wastedId: show.id },
      `ACTION: Шоу c id:${show.id} было обновлено.`,
    );
  }

  async syncRatings(model: IMediaModel): Promise<void> {
    const show = await TVShow.findOne({ 'external_ids.tmdb': model.id });
    if (!show) {
      showLogger.info(
        { tmdbID: model.id },
        `Шоу с tmdbID:${model.id} не найден`,
      );
      return;
    }
    const tomorrow = new Date(show.updatedAt);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const now = new Date();
    if (tomorrow < now) {
      show.ratings.tmdb = {
        rating: model.vote_average,
        vote_count: model.vote_count,
      };
      show.ratings.imdb = {
        rating: 0,
        vote_count: 0,
      };
      show.ratings.kinopoisk = {
        rating: 0,
        vote_count: 0,
      };
      show.updatedAt = new Date();
      await show.save();
      showLogger.info(
        { wastedId: model.id },
        `ACTION: Рейтинг шоу с id:${show.id} обновлен.`,
      );
      return;
    }
    showLogger.info(
      { wastedId: model.id },
      `ACTION: Рейтинг шоу с id:${show.id} уже обновлен. Рейтинг обновляется каждые сутки.`,
    );
  }

  async getLastShowId(): Promise<number> {
    const lastShowId = await TVShow.findOne().sort({ $natural: -1 });
    if (!lastShowId) {
      return 0;
    }
    return +lastShowId.external_ids.tmdb + 1;
  }

  // async delShowFromDb(show_id) {
  //   await People.updateMany(
  //     { 'shows.id': show_id },
  //     { $pull: { shows: { id: show_id } } },
  //   );
  //   const episodes = await Episode.deleteMany({ show_id });
  //   console.log('Episodes deleteCount', episodes.deletedCount);
  //   await Counters.findOneAndUpdate(
  //     { _id: 'episodeid' },
  //     { $inc: { seq: -episodes.deletedCount } },
  //   );
  //   const seasons = await Season.deleteMany({ show_id });
  //   console.log('Seasons deleteCount', seasons.deletedCount);
  //   await Counters.findOneAndUpdate(
  //     { _id: 'seasonid' },
  //     { $inc: { seq: -seasons.deletedCount } },
  //   );
  //   const show = await TVShow.findOneAndDelete({ id: show_id });
  //   if (!show) {
  //     console.log(`Шоу c id:${show_id} не существует в базе данных`);
  //     return;
  //   }
  //   await Counters.findOneAndUpdate({ _id: 'tvshowid' }, { $inc: { seq: -1 } });
  //   console.log(
  //     `Шоу c tmdbID:${show.external_ids.tmdb} и id:${show.id} был удален из базы данных`,
  //   );
  //   logEvents(
  //     `ACTION:Удален  ---  WastedId:${show.id} - tmdbID:${show.external_ids.tmdb} - Title:${show.title} `,
  //     'showDBLog.log',
  //   );
  // }
}
export default new TVShowService();
