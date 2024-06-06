import type { IFavoriteModel } from '#interfaces/IModel';
import { EpisodeSuperShort, MovieSuperShort, ShowSuperShort } from './index';

export class FavDto {
  movies: MovieSuperShort[];
  shows: ShowSuperShort[];
  episodes: EpisodeSuperShort[];

  //   games: GameShort[];
  constructor(model: IFavoriteModel) {
    this.movies = model.favoriteMovies.map((item) => {
      return new MovieSuperShort(item);
    });
    this.shows = model.favoriteShows.shows.map((item) => {
      return new ShowSuperShort(item);
    });
    this.episodes = model.favoriteShows.episodes.map((item) => {
      return new EpisodeSuperShort(item);
    });
    // this.games = model.favoriteGames.map((item) => {
    //   return new GameShort(item);
    // });
  }
}
