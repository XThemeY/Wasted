import { ISeason } from '#/interfaces/IFields';
import { Types } from 'mongoose';

export type Seasons = ISeason[] | Types.ObjectId[];
