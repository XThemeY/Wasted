import { Episode, Movie } from '#database/models';
import type { IUserWastedHistory } from '#interfaces/IApp';
import type { IWastedHistoryModel } from '#interfaces/IModel';
import type { WastedItem } from '#types/types';

export class UserWastedHistory implements IUserWastedHistory {
  items: { movies: WastedItem[]; shows: WastedItem[]; games: WastedItem[] };
  total_time: number;
  constructor(model: IWastedHistoryModel) {
    this.items = {
      movies: model.movies,
      shows: model.tvShows,
      games: model.games,
    };
  }
}
