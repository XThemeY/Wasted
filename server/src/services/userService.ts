import { User } from '#db/models/index.js';
import { UserSettingsDto } from '#utils/dtos/index.js';

class UserService {
  async getAllUsers(params = {}) {
    const searchParams = { ...params };
    const users = await User.find(searchParams, '-authentication')
      .populate('roles')
      .populate('wastedhistory.movies')
      .populate('wastedhistory.tvShows')
      .exec();

    const totalCount = await User.find(searchParams).count().exec();
    const response = { users, total_users: totalCount };
    return response;
  }

  async getUser(username) {
    const user = await User.findOne({ username }, '-authentication')
      .populate('roles')
      .populate('favorites.movies')
      .exec();
    return user;
  }

  async getUserSettings(username) {
    const user = await User.findOne(
      { username },
      'username email socialProfiles gameProfiles settings',
    ).exec();
    return user;
  }

  async setUserSettings(username, body) {
    const settings = await User.findOneAndUpdate(
      { username },
      { ...body },
      {
        new: true,
        runValidators: true,
      },
    ).exec();

    const newSettings = new UserSettingsDto(settings);
    return newSettings;
  }
}

export default new UserService();
