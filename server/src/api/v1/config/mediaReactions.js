import ApiError from '#utils/apiError.js';

const mediaReactions = {
  shocked: 'шок',
  thrilled: 'захватывающе',
  scared: 'пугающе',
  sad: 'печально',
  touched: 'тронуло',
  bored: 'скучно',
  confused: 'непонятно',
  amused: 'изумительно',
  tense: 'напряженно',
  reflective: 'задуматься',
};

export function getMediaReactions(query) {
  const newQuery = [];
  Array.from(new Set(query)).forEach((el) => {
    if (mediaReactions[el]) {
      return newQuery.push(el);
    }
    throw ApiError.BadRequest(
      `Ошибка запроса. Параметр "reactions" может быть пустым или содержать одно или несколько значений: [${Object.keys(mediaReactions)}]`,
    );
  });
  return newQuery;
}
