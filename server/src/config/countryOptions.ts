import { Country } from '#db/models/index.js';
import { ICountry } from '#interfaces/IFields';
import ApiError from '#utils/apiError.js';

export async function getСountryOptions(query): Promise<ICountry[] | number[]> {
  const countries = (await Country.find({})).map((item) => item.id);

  if (!query) {
    return countries;
  }

  const countriesQuery = query?.split(',').map(Number);
  if (countriesQuery?.every((item) => countries.includes(item))) {
    return countriesQuery;
  }

  throw ApiError.BadRequest(
    `Ошибка запроса. Параметр "country" может быть пустым или содержать числа от 0 до ${countries.length}`,
  );
}
