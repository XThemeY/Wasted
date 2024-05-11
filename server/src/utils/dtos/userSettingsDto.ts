export class UserSettingsDto {
  username: any;
  email: any;
  socialProfiles: any;
  gameProfiles: any;
  settings: any;
  constructor(model) {
    this.username = model.username;
    this.email = model.email;
    this.socialProfiles = model.socialProfiles;
    this.gameProfiles = model.gameProfiles;
    this.settings = model.settings;
  }
}
