export default class UserDto {
  constructor(model) {
    this.username = model.username;
    this._id = model._id;
    this.id = model.id;
    this.email = model.email;
    this.isActivated = model.authentication.isActivated;
  }
}
