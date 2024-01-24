import IUserState from './IUserState';

export default interface IAuthRes {
  accessToken: string;
  refreshToken: string;
  user: IUserState;
}
