import { Genre } from '#db/models/index.js';
import ApiError from '#utils/apiError.js';

export async function getGenreOptions(query: string): Promise<number[]> {
  const genres = (await Genre.find({})).map((item) => item.id) as number[];

  if (!query) {
    return genres;
  }

  const genresQuery = query?.split(',').map(Number);
  if (genresQuery?.every((item) => genres.includes(item))) {
    return genresQuery;
  }

  throw ApiError.BadRequest(
    `Ошибка запроса. Параметр "genre" может быть пустым или содержать числа от 1 до ${genres.length}`,
  );
}
