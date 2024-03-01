import { TVShow } from '../database/models/index.js';
import { newMediaDto } from '../dtos/index.js';
import ApiError from '../utils/apiError.js';
class TVShowService {
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
      const count = TVShow.find({
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
        .count()
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
      return new newMediaDto(show);
    });
    newShows.page = page + 1;
    newShows.total_pages = total_pages;
    newShows.total_items = total_items;

    return newShows;
  }
}
export default new TVShowService();
