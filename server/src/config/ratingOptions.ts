import type { RatingTuple } from '#types/types';

const ratingOptions = ['poop', 'pokerface', 'beer', 'good', 'favorite'];

export async function getRatingOptions(query: number): Promise<RatingTuple> {
  return [ratingOptions[query - 1], query];
}
