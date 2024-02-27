import ApiError from '../utils/apiError.js';

const sortOptions = [
  'popularity.desc',
  'popularity.asc',
  'release_date.desc',
  'release_date.asc',
  'rating.desc',
  'rating.asc',
  'watch_count.desc',
  'watch_count.asc',
];

export function getSortOptions(query) {
  if (!query) {
    return sortOptions[0].split('.');
  }

  if (query && sortOptions.includes(query)) {
    return query.split('.');
  }

  throw ApiError.BadRequest(
    `Ошибка запроса. Параметр "sort_by" может быть пустым или содержать одно из значений [${sortOptions}]. По умолчанию:'${sortOptions[0]}'.`,
  );
}
