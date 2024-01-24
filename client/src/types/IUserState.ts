export default interface IUserState {
  username: string | null;
  id: string | null;
  email: string | null;
  isActivated: boolean;
  isLogedIn: boolean;
  // favorites: {
  //   movies: [];
  //   tvShows: [];
  //   games: [];
  // };
  // wastedHistory: {
  //   movies: [];
  //   tvShows: [];
  //   games: [];
  // };
  // settings: {
  //   privacy: {
  //     showProfileTo: string;
  //     shareWastedHistory: boolean;
  //   };
  //   theme: string;
  //   language: string;
  //   timeZone: string;
  //   notifications: boolean;
  // };
}
