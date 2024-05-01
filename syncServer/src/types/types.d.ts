import type { ISeason } from '#interfaces/IFields.d.ts';
import { Types } from 'mongoose';

export type Seasons = ISeason[] | Types.ObjectId[];
