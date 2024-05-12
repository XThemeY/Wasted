import type { RatingTuple } from '#types/types';

const ratingOptions = ['poop', 'pokerface', 'beer', 'good', 'favorite'];

export function getRatingOptions(query: number): RatingTuple {
  return [ratingOptions[query - 1], query];
}
