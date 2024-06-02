import { User } from '#db/models/index.js';
import ApiError from '#utils/apiError';
import { UserSettingsDto } from '#utils/dtos/index.js';
import { model } from 'mongoose';

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

  async getUser(username: string) {
    const user = await User.findOne({ username }, '-authentication')
      .populate({
        path: 'favorites',
        populate: {
          path: 'favoriteMovies favoriteShows',
        },
      })
      .exec();
    if (!user)
      throw ApiError.BadRequest(
        `Пользователь с таким username:${username} не существует`,
      );
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
