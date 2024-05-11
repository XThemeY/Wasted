import type { ITokenModel } from '#interfaces/IModel';
import { Schema, model } from 'mongoose';

const tokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
});

const Token = model<ITokenModel>('Token', tokenSchema);

export default Token;
