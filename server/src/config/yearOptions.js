import { Movie, TVShow } from '../database/models/index.js';
import ApiError from '../utils/apiError.js';

export async function getStartYear(query) {
  const { release_date } = await Movie.findOne({})
    .sort({ release_date: 1 })
    .select({ release_date: 1 });

  const { start_date } = await TVShow.findOne({})
    .sort({ start_date: 1 })
    .select({ start_date: 1 });

  const minDate =
    +new Date(release_date) <= +new Date(start_date)
      ? new Date(release_date)
      : new Date(start_date);

  if (!query) {
    return minDate;
  }

  const queryDate = new Date(query);
  if (queryDate.getUTCFullYear() >= minDate.getUTCFullYear()) {
    return queryDate;
  }

  throw ApiError.BadRequest(
    `Ошибка запроса. Параметр "start_year" может быть пустым или не меньше, чем ${minDate.getUTCFullYear()}`,
  );
}

export async function getEndYear(query) {
  const { release_date } = await Movie.findOne({})
    .sort({ release_date: -1 })
    .select({ release_date: 1 });

  const { start_date } = await TVShow.findOne({})
    .sort({ start_date: -1 })
    .select({ start_date: 1 });

  const maxDate =
    +new Date(release_date) >= +new Date(start_date)
      ? new Date(release_date)
      : new Date(start_date);

  if (!query) {
    return maxDate;
  }

  const queryDate = new Date(query, 12);
  if (queryDate.getUTCFullYear() <= maxDate.getUTCFullYear()) {
    return queryDate;
  }

  throw ApiError.BadRequest(
    `Ошибка запроса. Параметр "end_year" может быть пустым или не больше, чем ${maxDate.getUTCFullYear()}`,
  );
}

export function compareYears(start_year, end_year) {
  if (start_year.getUTCFullYear() > end_year.getUTCFullYear()) {
    throw ApiError.BadRequest(
      `Ошибка запроса. Параметр "start_year" не может быть больше "end_year"`,
    );
  }
}
