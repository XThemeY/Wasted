import { Types } from 'mongoose';

export class UserDto {
  username: string;
  _id: Types.ObjectId;
  id: number;
  userRoles: string[];
  refreshToken?: string;
  activationLink?: string;

  constructor(model) {
    this.username = model.username;
    this._id = model._id;
    this.id = model.id;
    this.userRoles = model.settings.userRoles;
  }
}
