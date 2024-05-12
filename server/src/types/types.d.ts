import type { ISeason } from '#interfaces/IFields.d.ts';
import type { Types } from 'mongoose';

export type Seasons = ISeason[] | Types.ObjectId[];

export type RatingTuple = [string, number];

export type ResponseMsg = {
  status: string;
  type: string;
  id: number;
  rating?: number;
  reactions?: string[];
  message: string;
};

export type Reactions = {
  [key: string]: string;
};
