import { TVShow, WastedHistory } from '#db/models/index.js';
import { ShowShort } from '#utils/dtos/index.js';
import ApiError from '#utils/apiError.js';
import type { IReactions } from '#interfaces/IFields';
import type { ISeasonModel, IShowModel } from '#interfaces/IModel';
import { showPopFields } from '#config/index.js';
import type {
  IErrMsg,
  ISearchQuery,
  ISearchResult,
  IShowUpdate,
} from '#interfaces/IApp';

class TVShowService {
  async getShow(id: number): Promise<IShowModel> {
    const show = await TVShow.findOne({ id })
      .populate(showPopFields)
      .populate({
        path: 'seasons',
        populate: {
          path: 'episodes',
        },
      })
      .exec();
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
    start_year_default,
    end_year_default,
    genres,
    countries,
    tvPlatforms,
    wastedIds,
  }: ISearchQuery): Promise<ISearchResult | IErrMsg> {
    const newShows = { items: [], page, total_pages: 0, total_items: 0 };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseQuery: any = {
      $or: [
        { title: { $regex: title, $options: 'i' } },
        { title_original: { $regex: title, $options: 'i' } },
      ],
      genres: { $in: genres },
      countries: { $in: countries },
      platforms: { $in: tvPlatforms },
      id: { $nin: wastedIds },
    };

    if (start_year !== undefined && end_year !== undefined) {
      baseQuery.start_date = {
        $gte: start_year,
        $lte: end_year,
      };
    } else if (start_year !== undefined) {
      baseQuery.start_date = {
        $gte: start_year,
        $lte: end_year_default,
      };
    } else if (end_year !== undefined) {
      baseQuery.start_date = {
        $gte: start_year_default,
        $lte: end_year,
      };
    } else {
      baseQuery.$or.push(
        {
          start_date: {
            $gte: start_year_default,
            $lte: end_year_default,
          },
        },
        { start_date: null },
      );
    }

    const countQuery = new Promise<number>(function (resolve, reject) {
      const count = TVShow.countDocuments(baseQuery);
      resolve(count);
      reject(ApiError.InternalServerError());
    });

    const dataQuery = new Promise<IShowModel[]>(function (resolve, reject) {
      const data = TVShow.find(baseQuery)
        .sort([sort_by])
        .skip(page * limit)
        .limit(limit)
        .populate(showPopFields)
        .exec();
      resolve(data);
      reject(ApiError.InternalServerError());
    });

    //Maybe Promise.allSetlled?
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
      .filter((el: ISeasonModel) => el.rating !== 0 && el.season_number !== 0)
      .map((el: ISeasonModel) => el.rating);
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
    const watch_count = await WastedHistory.countDocuments({
      tvShows: {
        $elemMatch: {
          itemId: id,
          status: { $in: ['watched', 'watching'] },
        },
      },
    });

    await TVShow.updateOne({ id }, { $set: { watch_count } }).exec();
    return watch_count;
  }
}
export default new TVShowService();
