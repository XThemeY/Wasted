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
import type { IShow } from '#interfaces/IModel.d.ts';
import { logger } from '#middleware/index.js';
import { logNames } from '#config/index.js';
import { setShowDuration } from '#utils/showDuraion.js';

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
    model: IShow,
    modelENG: IShow,
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
      await TVShow.updateOne(
        { 'external_ids.tmdb': model.id },
        {
          $set: {
            images: await getMediaImages(show.id, 'show', model),
            genres: await getGenres(model.genres, modelENG.genres),
            countries: await getCountries(model.production_countries),
            creators: await getPeoples(
              model.created_by,
              'creator',
              show.id,
              'show',
            ),
            cast: await getPeoples(model.credits, 'actor', show.id, 'show'),
            tags: await getTags(model.keywords.results),
            platforms: await getPlatforms(model.networks),
            production_companies: await getProdCompanies(
              model.production_companies,
            ),
            seasons: await getSeasons(
              show.id,
              model.seasons,
              modelENG.seasons,
              model.id,
            ),
          },
        },
      );
      await setShowDuration(show.id);
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

  async syncPeoples(model: IShow): Promise<void> {
    const show = await TVShow.findOne({ 'external_ids.tmdb': model.id });
    await TVShow.updateOne(
      { 'external_ids.tmdb': model.id },
      {
        creators: await getPeoples(
          model.created_by,
          'creator',
          show.id,
          'show',
        ),
        cast: await getPeoples(model.credits, 'actor', show.id, 'show'),
      },
    );
  }

  async syncShow(
    model: IShow,
    modelENG: IShow,
    isFullSync: boolean,
  ): Promise<IShow> {
    const show = await TVShow.findOne({ 'external_ids.tmdb': model.id });
    if (!show) {
      showLogger.info(
        { tmdbID: model.id },
        `ACTION: Шоу c tmdbID:${model.id} не существует в базе данных`,
      );
      return show;
    }
    const syncShow = await TVShow.findOneAndUpdate(
      { 'external_ids.tmdb': model.id },
      {
        $set: {
          title: model.name,
          title_original: model.original_name,
          start_date: model.first_air_date,
          end_date: model.last_air_date,
          description: model.overview,
          description_original: modelENG.overview,
          status: model.status,
          number_of_seasons: model.number_of_seasons,
          number_of_episodes: model.number_of_episodes,
          popularity: model.popularity,
          updatedAt: new Date(),
        },
      },
    );
    if (isFullSync) {
      await this.syncFields(show.id, model, modelENG);
      await setShowDuration(show.id);
    }
    await this.syncRatings(model);
    showLogger.info(
      { wastedId: show.id },
      `ACTION: Шоу c id:${show.id} было обновлено.`,
    );
    return syncShow;
  }

  async syncFields(
    showId: number,
    model: IShow,
    modelENG: IShow,
  ): Promise<void> {
    await TVShow.updateOne(
      { 'external_ids.tmdb': model.id },
      {
        $set: {
          images: await getMediaImages(showId, 'show', model),
          genres: await getGenres(model.genres, modelENG.genres),
          countries: await getCountries(model.production_countries),
          creators: await getPeoples(
            model.created_by,
            'creator',
            showId,
            'show',
          ),
          cast: await getPeoples(model.credits, 'actor', showId, 'show'),
          tags: await getTags(model.keywords.results),
          platforms: await getPlatforms(model.networks),
          production_companies: await getProdCompanies(
            model.production_companies,
          ),
          seasons: await getSeasons(
            showId,
            model.seasons,
            modelENG.seasons,
            model.id,
          ),
          updatedAt: new Date(),
        },
      },
    );
  }

  async syncRatings(model: IShow): Promise<void> {
    const show = await TVShow.findOne({ 'external_ids.tmdb': model.id });
    if (!show) {
      showLogger.info(
        { tmdbID: model.id },
        `Шоу с tmdbID:${model.id} не найден`,
      );
      return;
    }
    await TVShow.updateOne(
      { 'external_ids.tmdb': model.id },
      {
        $set: {
          'ratings.tmdb': {
            rating: model.vote_average,
            vote_count: model.vote_count,
          },
          'ratings.imdb': {
            rating: 0,
            vote_count: 0,
          },
          'ratings.kinopoisk': {
            rating: 0,
            vote_count: 0,
          },
          updatedAt: new Date(),
        },
      },
    );
    showLogger.info(
      { wastedId: model.id },
      `ACTION: Рейтинг шоу с id:${show.id} обновлен.`,
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
