import { Episode, Movie, TVShow, Favorites } from '../database/models/index.js';
import ApiError from '../utils/apiError.js';

class FavoriteService {
  async setMovieFav(username, movieId) {
    const isFav = await Favorites.exists({
      username,
      movies: movieId,
    });
    const isMovieExists = await Movie.exists({
      id: movieId,
    });
    if (!isMovieExists) {
      throw ApiError.BadRequest(`Фильма с таким id не существует`);
    }
    if (!isFav) {
      await Favorites.updateOne(
        { username },
        { $push: { movies: [movieId] } },
        { upsert: true, runValidators: true },
      );
      return;
    }
    throw ApiError.BadRequest(`Объект уже в избранном`);
  }

  async delMovieFav(username, movieId) {
    const isFav = await Favorites.exists({
      username,
      movies: movieId,
    });
    if (!isFav) {
      throw ApiError.BadRequest(`Объект не добавлен в избранное`);
    }
    await Favorites.updateOne({ username }, { $pull: { movies: movieId } });
  }

  async setShowFav(username, showId) {
    const isFav = await Favorites.exists({
      username,
      'tvShows.shows': showId,
    });
    const isShowExists = await TVShow.exists({
      id: showId,
    });
    if (!isShowExists) {
      throw ApiError.BadRequest(`Шоу с таким id не существует`);
    }
    if (!isFav) {
      await Favorites.updateOne(
        { username },
        { $push: { 'tvShows.shows': [showId] } },
        { upsert: true, runValidators: true },
      );
      return;
    }
    throw ApiError.BadRequest(`Объект уже в избранном`);
  }

  async delShowFav(username, showId) {
    const isFav = await Favorites.exists({
      username,
      'tvShows.shows': showId,
    });
    if (!isFav) {
      throw ApiError.BadRequest(`Объект не добавлен в избранное`);
    }
    await Favorites.updateOne(
      { username },
      { $pull: { 'tvShows.shows': showId } },
    );
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
      return;
    }
    throw ApiError.BadRequest(`Объект уже в избранном`);
  }

  async delEpisodeFav(username, episodeId) {
    const isFav = await Favorites.exists({
      username,
      'tvShows.episodes': episodeId,
    });
    if (!isFav) {
      throw ApiError.BadRequest(`Объект не добавлен в избранное`);
    }
    await Favorites.updateOne(
      { username },
      { $pull: { 'tvShows.episodes': episodeId } },
    );
  }
}

export default new FavoriteService();
