import { INewuser } from '@types';

export async function createUserAccount(user: INewUser) {
  try {
    console.log('Account created', user);
  } catch (error) {
    console.log(error);
    return error;
  }
}
