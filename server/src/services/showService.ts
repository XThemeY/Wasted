import { TVShow, WastedHistory } from '#db/models/index.js';
import { NewMediaDto } from '#utils/dtos/index.js';
import ApiError from '#utils/apiError.js';
class TVShowService {
  async getShow(id) {
    const movie = await TVShow.findOne({ id })
      .populate({
        path: 'countries tags creators.person cast.person production_companies comments',
      })
      .exec();
    return movie;
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
  }) {
    const newShows = { items: [], page, total_pages: 0, total_items: 0 };

    const countQuery = new Promise(function (resolve, reject) {
      const count = TVShow.countDocuments({
        $or: [
          { title: { $regex: title, $options: 'i' } },
          { title_original: { $regex: title, $options: 'i' } },
        ],
      })
        .where('start_date')
        .gte(start_year)
        .lte(end_year)
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

    const dataQuery = new Promise(function (resolve, reject) {
      const data = TVShow.find({
        $or: [
          { title: { $regex: title, $options: 'i' } },
          { title_original: { $regex: title, $options: 'i' } },
        ],
      })
        .populate('countriesId genresId platformsId')
        .where('start_date')
        .gte(start_year)
        .lte(end_year)
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
      return { message: `Шоу не найдены` };
    }

    newShows.items = total_shows.map((show) => {
      return new NewMediaDto(show);
    });
    newShows.page = page + 1;
    newShows.total_pages = total_pages;
    newShows.total_items = total_items;

    return newShows;
  }

  async setWatchCount(id) {
    const show = await TVShow.findOne(
      {
        id,
      },
      'watch_count',
    ).exec();

    if (!show) {
      throw ApiError.BadRequest(`Шоу с таким id:${id} не существует`);
    }
    show.watch_count = await WastedHistory.find({
      'tvShows.itemId': id,
      'tvShows.status': { $in: ['watched', 'watching'] },
    })
      .count()
      .exec();
    await show.save();
  }

  async setTotalRating(showId) {
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
      return;
    }
    const showRating =
      showArr.reduce((sum, value) => sum + value) / showArr.length;
    show.rating = showRating % 1 === 0 ? showRating : showRating.toFixed(2);
    await show.save();
  }

  async setTotalReactions(showId) {
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
      return;
    }
    reactionsKeys.forEach((key) => {
      show.reactions[key].value = (
        (100 * show.reactions[key].vote_count) /
        total_votes
      ).toFixed(0);
    });
    await show.save();
  }
}
export default new TVShowService();
