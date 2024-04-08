export class UserDto {
  constructor(model) {
    this.username = model.username;
    this._id = model._id;
    this.id = model.id;
    this.userRoles = model.settings.userRoles;
  }
}
