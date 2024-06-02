import { Episode, Movie, TVShow, Favorites } from '#db/models/index.js';
import type { IFavoriteModel } from '#interfaces/IModel';
import ApiError from '#utils/apiError.js';

class FavoriteService {
  async setMovieFav(
    username: string,
    itemId: number,
  ): Promise<{
    status: string;
    message: string;
  }> {
    const isFav = await Favorites.exists({
      username,
      movies: itemId,
    });
    const isMovieExists = await Movie.findOne({
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

  async setShowFav(
    username: string,
    itemId: number,
  ): Promise<{
    status: string;
    message: string;
  }> {
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

  async setEpisodeFav(
    username: string,
    episodeId: number,
  ): Promise<{
    status: string;
    message: string;
  }> {
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

  async getFavorites(username: string): Promise<IFavoriteModel> {
    const favs = await Favorites.findOne({ username });
    if (!favs) throw ApiError.BadRequest(`Список избранного пуст`);
    return favs;
  }
}

export default new FavoriteService();
