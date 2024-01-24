import { User } from '../db/models/index.js';

class UserService {
  async getAllUsers() {
    const users = await User.find({}, '-authentication')
      .populate('roles')
      .populate('favorites.movies')
      .exec();

    const totalCount = await User.countDocuments();
    const response = { items: users, total_items: totalCount };
    return response;
  }
}

export default new UserService();
