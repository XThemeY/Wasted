import ApiError from '#utils/apiError.js';

const ratingOptions = ['poop', 'pokerface', 'beer', 'good', 'favorite'];

export function getRatingOptions(query: string): string[] {
  if (!query) {
    throw ApiError.BadRequest(
      `Ошибка запроса. Поле "rating" должно быть от 1 до 5.`,
    );
  }

  if (query && ratingOptions[query - 1]) {
    return [ratingOptions[query - 1], query];
  }

  throw ApiError.BadRequest(
    `Ошибка запроса. Поле "rating" должно быть от 1 до 5.`,
  );
}
