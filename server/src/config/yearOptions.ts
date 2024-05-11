import { Movie, TVShow } from '#db/models/index.js';
import ApiError from '#utils/apiError.js';

export async function getStartYear(query: number): Promise<Date> {
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
  const maxDate = (await getEndYear(null)).getUTCFullYear();
  const queryDate = new Date(query.toString());

  if (
    queryDate.getUTCFullYear() >= minDate.getUTCFullYear() &&
    queryDate.getUTCFullYear() <= maxDate
  ) {
    return queryDate;
  }

  throw ApiError.BadRequest(
    `Ошибка запроса. Параметр "start_year" может быть пустым, меньше, чем ${minDate.getUTCFullYear()} и больше, чем ${maxDate}`,
  );
}

export async function getEndYear(query: number | null): Promise<Date> {
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

export function compareYears(start_year, end_year): void {
  if (start_year.getUTCFullYear() > end_year.getUTCFullYear()) {
    throw ApiError.BadRequest(
      `Ошибка запроса. Параметр "start_year" не может быть больше "end_year"`,
    );
  }
}
