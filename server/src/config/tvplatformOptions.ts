import { TVPlatform } from '#db/models/index.js';
import { IPlatform } from '#interfaces/IFields';
import ApiError from '#utils/apiError.js';

export async function getTvPlatformsOptions(
  query: string,
): Promise<IPlatform[] | number[]> {
  const tvPlatforms = (await TVPlatform.find({})).map((item) => item.id);

  if (!query) {
    return tvPlatforms;
  }

  const tvPlatformsQuery = query?.split(',').map(Number);
  if (tvPlatformsQuery?.every((item) => tvPlatforms.includes(item))) {
    return tvPlatformsQuery;
  }

  throw ApiError.BadRequest(
    `Ошибка запроса. Параметр "tvplatform" может быть пустым или содержать числа от 1 до ${tvPlatforms.length}`,
  );
}
