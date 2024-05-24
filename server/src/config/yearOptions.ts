import { Movie, TVShow } from '#db/models/index.js';
import ApiError from '#utils/apiError.js';

// Функция для получения минимальной даты
export async function getMinDate(): Promise<Date> {
  const movie = await Movie.findOne({ release_date: { $ne: null } })
    .sort({ release_date: 1 })
    .select({ release_date: 1 });

  const tvShow = await TVShow.findOne({ start_date: { $ne: null } })
    .sort({ start_date: 1 })
    .select({ start_date: 1 });

  const minDate =
    new Date(movie.release_date) <= new Date(tvShow.start_date)
      ? new Date(movie.release_date)
      : new Date(tvShow.start_date);

  return minDate;
}

// Функция для получения максимальной даты
export async function getMaxDate(): Promise<Date> {
  const movie = await Movie.findOne({ release_date: { $ne: null } })
    .sort({ release_date: -1 })
    .select({ release_date: 1 });

  const tvShow = await TVShow.findOne({ start_date: { $ne: null } })
    .sort({ start_date: -1 })
    .select({ start_date: 1 });

  const maxDate =
    new Date(movie.release_date) >= new Date(tvShow.start_date)
      ? new Date(movie.release_date)
      : new Date(tvShow.start_date);

  return maxDate;
}

// Основная функция для получения начального года
export async function getStartYear(
  query: number | undefined,
): Promise<Date | undefined> {
  if (!query) {
    return undefined;
  }
  const minDate = await getMinDate();
  const maxDate = (await getMaxDate()).getUTCFullYear();
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

// Основная функция для получения конечного года
export async function getEndYear(
  query: number | undefined,
): Promise<Date | undefined> {
  if (!query) {
    return undefined;
  }
  const maxDate = await getMaxDate();
  const queryDate = new Date(query, 12);
  if (queryDate.getUTCFullYear() <= maxDate.getUTCFullYear()) {
    return queryDate;
  }

  throw ApiError.BadRequest(
    `Ошибка запроса. Параметр "end_year" может быть пустым или не больше, чем ${maxDate.getUTCFullYear()}`,
  );
}

// Функция для сравнения начального и конечного года
export function compareYears(
  start_year: Date | undefined,
  end_year: Date | undefined,
): void {
  if (!start_year || !end_year) {
    return;
  }
  if (start_year.getUTCFullYear() > end_year.getUTCFullYear()) {
    throw ApiError.BadRequest(
      `Ошибка запроса. Параметр "start_year" не может быть больше "end_year"`,
    );
  }
}
