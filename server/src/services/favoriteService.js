import { Episode, Movie, TVShow, Favorites } from 'Main/src/database/models/index.js';
import ApiError from 'Main/src/utils/apiError.js';

class FavoriteService {
  async setMovieFav(username, itemId) {
    const isFav = await Favorites.exists({
      username,
      movies: itemId,
    });
    const isMovieExists = await Movie.exists({
      id: itemId,
    });
    if (!isMovieExists) {
      throw ApiError.BadRequest(`Фильма с таким id не существует`);
    }
    if (!isFav) {
      await Favorites.updateOne(
        { username },
        { $push: { movies: [itemId] } },
        { upsert: true, runValidators: true },
      );
      return {
        status: 'added',
        message: `Фильм с id:${itemId} добавлен в Избранное`,
      };
    }
    await Favorites.updateOne({ username }, { $pull: { movies: itemId } });
    return {
      status: 'del',
      message: `Фильм с id:${itemId} удален из Избранного`,
    };
  }

  async setShowFav(username, itemId) {
    const isFav = await Favorites.exists({
      username,
      'tvShows.shows': itemId,
    });
    const isShowExists = await TVShow.exists({
      id: itemId,
    });
    if (!isShowExists) {
      throw ApiError.BadRequest(`Шоу с таким id:${itemId} не существует`);
    }
    if (!isFav) {
      await Favorites.updateOne(
        { username },
        { $push: { 'tvShows.shows': [itemId] } },
        { upsert: true, runValidators: true },
      );
      return {
        status: 'added',
        message: `Шоу с id:${itemId} добавлено в Избранное`,
      };
    }
    await Favorites.updateOne(
      { username },
      { $pull: { 'tvShows.shows': itemId } },
    );
    return {
      status: 'del',
      message: `Шоу с id:${itemId} удалено из Избранного`,
    };
  }

  async setEpisodeFav(username, episodeId) {
    const isFav = await Favorites.exists({
      username,
      'tvShows.episodes': episodeId,
    });
    const isEpisodeExists = await Episode.exists({
      id: episodeId,
    });
    if (!isEpisodeExists) {
      throw ApiError.BadRequest(`Эпизода с таким id не существует`);
    }
    if (!isFav) {
      await Favorites.updateOne(
        { username },
        { $push: { 'tvShows.episodes': [episodeId] } },
        { upsert: true, runValidators: true },
      );
      return {
        status: 'added',
        message: `Эпизод с id:${episodeId} добавлен в Избранное`,
      };
    }
    await Favorites.updateOne(
      { username },
      { $pull: { 'tvShows.episodes': episodeId } },
    );
    return {
      status: 'del',
      message: `Эпизод с id:${episodeId} удален из Избранного`,
    };
  }
}

export default new FavoriteService();
