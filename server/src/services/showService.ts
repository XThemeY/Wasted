import { TVShow, WastedHistory } from '#db/models/index.js';
import { ShowShort } from '#utils/dtos/index.js';
import ApiError from '#utils/apiError.js';
import type { IReactions } from '#interfaces/IFields';
import type { IShowModel } from '#interfaces/IModel';
import { showPopFields } from '#config/index.js';
import type {
  IErrMsg,
  ISearchQuery,
  ISearchResult,
  IShowUpdate,
} from '#interfaces/IApp';
class TVShowService {
  async getShow(id: number): Promise<IShowModel> {
    const show = await TVShow.findOne({ id }).populate(showPopFields).exec();
    return show;
  }

  async updateShow(id: number, options: IShowUpdate): Promise<IShowModel> {
    const show = await TVShow.findOneAndUpdate(
      { id },
      { ...options },
      { new: true, runValidators: true },
    )
      .populate(showPopFields)
      .exec();
    return show;
  }

  async exploreShows({
    page,
    limit,
    sort_by,
    title,
    start_year,
    end_year,
    genres,
    countries,
    tvPlatforms,
    wastedIds,
  }: ISearchQuery): Promise<ISearchResult | IErrMsg> {
    const newShows = { items: [], page, total_pages: 0, total_items: 0 };

    const countQuery = new Promise<number>(function (resolve, reject) {
      const count = TVShow.countDocuments({
        $or: [
          { title: { $regex: title, $options: 'i' } },
          { title_original: { $regex: title, $options: 'i' } },
        ],
      })
        .where('start_date')
        .gte(start_year as number)
        .lte(end_year as number)
        .where('genres')
        .in(genres)
        .where('countries')
        .in(countries)
        .where('platforms')
        .in(tvPlatforms)
        .nin('id', wastedIds)
        .exec();
      resolve(count);
      reject(ApiError.InternalServerError());
    });

    const dataQuery = new Promise<IShowModel[]>(function (resolve, reject) {
      const data = TVShow.find({
        $or: [
          { title: { $regex: title, $options: 'i' } },
          { title_original: { $regex: title, $options: 'i' } },
        ],
      })
        .populate('countriesId genresId platformsId')
        .where('start_date')
        .gte(start_year as number)
        .lte(end_year as number)
        .where('genres')
        .in(genres)
        .where('countries')
        .in(countries)
        .where('platforms')
        .in(tvPlatforms)
        .nin('id', wastedIds)
        .sort([sort_by])
        .skip(page * limit)
        .limit(limit)
        .exec();
      resolve(data);
      reject(ApiError.InternalServerError());
    });

    const results = await Promise.all([countQuery, dataQuery]);

    const total_shows = results[1];
    const total_items = results[0];
    const total_pages = Math.ceil(total_items / limit);

    if (page + 1 > total_pages && total_pages !== 0) {
      return { message: 'Invalid page' };
    }
    if (!total_shows.length) {
      return { message: `Shows not found` };
    }

    newShows.items = total_shows.map((show) => {
      return new ShowShort(show);
    });
    newShows.page = page + 1;
    newShows.total_pages = total_pages;
    newShows.total_items = total_items;

    return newShows;
  }

  async setTotalRating(showId: number): Promise<number> {
    const show = await TVShow.findOne(
      {
        id: showId,
      },
      'seasons rating',
    )
      .populate('seasons', 'season_number rating')
      .exec();
    const showArr = show.seasons
      .filter((el) => el.rating !== 0 && el.season_number !== 0)
      .map((el) => el.rating);
    if (!showArr.length) {
      show.rating = 0;
      await show.save();
      return show.rating;
    }
    const showRating =
      showArr.reduce((sum, value) => sum + value, 0) / showArr.length;
    show.rating = showRating % 1 === 0 ? showRating : +showRating.toFixed(2);
    await show.save();
    return show.rating;
  }

  async setTotalReactions(showId: number): Promise<IReactions> {
    const show = await TVShow.findOne({ id: showId }, 'reactions')
      .populate('seasons', 'season_number reactions')
      .exec();

    const reactionsKeys = Object.keys(show.reactions);
    reactionsKeys.forEach((key) => {
      show.reactions[key].vote_count = 0;
    });

    show.seasons.forEach((el) => {
      Object.keys(el.reactions).forEach((key) => {
        show.reactions[key].vote_count += el.reactions[key].vote_count;
      });
    });

    const total_votes = reactionsKeys.reduce(
      (acc, key) => acc + show.reactions[key].vote_count,
      0,
    );

    if (!total_votes) {
      reactionsKeys.forEach((key) => {
        show.reactions[key].value = 0;
      });
      await show.save();
      return show.reactions;
    }
    reactionsKeys.forEach((key) => {
      show.reactions[key].value = +(
        (100 * show.reactions[key].vote_count) /
        total_votes
      ).toFixed(0);
    });
    await show.save();
    return show.reactions;
  }

  async setWatchCount(id: number): Promise<number> {
    const show = await TVShow.findOne(
      {
        id,
      },
      'watch_count',
    ).exec();

    if (!show) {
      throw ApiError.BadRequest(`Шоу с таким id:${id} не существует`);
    }
    show.watch_count = await WastedHistory.countDocuments({
      'tvShows.itemId': id,
      'tvShows.status': { $in: ['watched', 'watching'] },
    }).exec();
    await show.save();
    return show.watch_count;
  }
}
export default new TVShowService();