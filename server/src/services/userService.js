import { now } from 'mongoose';
import { User } from '../database/models/index.js';

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

  async setMovieToWasted(username, itemId, status) {
    const isWasted = await User.findOne(
      {
        username,
        'wastedHistory.movies.itemId': itemId,
      },
      { 'wastedHistory.movies.$': itemId },
    );
    if (!isWasted) {
      const newWastedMovie = {
        itemId,
        status,
        watchCount: 1,
      };
      await User.updateOne(
        { username },
        { $push: { 'wastedHistory.movies': [newWastedMovie] } },
      );
      return;
    }
    if (status !== isWasted?.wastedHistory.movies[0].status) {
      await User.updateOne(
        { username, 'wastedHistory.movies.itemId': itemId },
        { $set: { 'wastedHistory.movies.$.status': status } },
      );
      return;
    }
    await User.updateOne(
      { username },
      { $pull: { 'wastedHistory.movies': { itemId } } },
    );
  }

  async setShowToWasted(username, itemId, status) {
    const isWasted = await User.findOne(
      {
        username,
        'wastedHistory.tvShows.itemId': itemId,
      },
      { 'wastedHistory.tvShows.$': itemId },
    );

    if (!isWasted) {
      const newWastedShow = {
        itemId,
        status,
        watchCount: 1,
      };
      await User.updateOne(
        { username },
        { $push: { 'wastedHistory.tvShows': [newWastedShow] } },
      );
      return;
    }
    if (status !== isWasted?.wastedHistory.tvShows[0].status) {
      await User.updateOne(
        { username, 'wastedHistory.tvShows.itemId': itemId },
        { $set: { 'wastedHistory.tvShows.$.status': status } },
      );
      return;
    }
    await User.updateOne(
      { username },
      { $pull: { 'wastedHistory.tvShows': { itemId } } },
    );
  }

  async setMovieToFav(username, itemId) {
    const isFav = await User.exists({
      username,
      'favorites.movies': itemId,
    });

    if (!isFav) {
      await User.updateOne(
        { username },
        { $push: { 'favorites.movies': [itemId] } },
      );
      return;
    }
    await User.updateOne(
      { username },
      { $pull: { 'favorites.movies': itemId } },
    );
  }

  async setShowToFav(username, itemId) {
    const isFav = await User.exists({
      username,
      'favorites.tvShows': itemId,
    });

    if (!isFav) {
      await User.updateOne(
        { username },
        { $push: { 'favorites.tvShows': [itemId] } },
      );
      return;
    }
    await User.updateOne(
      { username },
      { $pull: { 'favorites.tvShows': itemId } },
    );
  }

  async getWastedIds(username, type) {
    if (!username) {
      return [];
    }
    const wastedIds = (
      await User.findOne({ username }, `wastedHistory.${type}`)
    )?.wastedHistory[type]
      .filter((item) => item.status === 'watched')
      .map((item) => item.itemId);
    return wastedIds;
  }
}

export default new UserService();
