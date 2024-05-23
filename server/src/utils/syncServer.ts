import { logNames } from '#config';
import { logger } from '#middleware';
import axios from 'axios';
import { STATUS_CODES } from 'http';

const syncLogger = logger(logNames.sync).child({ module: 'syncServer' });

export enum MediaType {
  movie = 'movies',
  show = 'tv',
  game = 'games',
}
export const syncMedia = async (
  id: number,
  type: MediaType,
  updatedAt: Date,
  isFullSync: boolean = false,
): Promise<boolean | void> => {
  const isUpdated = isMediaUpdated(updatedAt);
  try {
    if (isUpdated) {
      const { data } = await axios.patch(
        process.env.SYNC_SERVER_URL +
          `/tmdb/${type}/` +
          id +
          '?fullSync=' +
          isFullSync,
      );
      if (data === STATUS_CODES[200]) {
        return true;
      }
      return false;
    }
  } catch (error) {
    syncLogger.error(error?.message);
  }
};

export const isMediaUpdated = (date: Date): boolean => {
  const tomorrow = new Date(date);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const now = new Date();
  return tomorrow < now;
};
