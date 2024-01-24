import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import { IAuthRes, IUserState } from '@/types/';

const initialState: IUserState = {
  username: null,
  id: null,
  email: null,
  isActivated: false,
  isLogedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<IAuthRes>) => {
      const { accessToken, user } = action.payload;
      localStorage.setItem('access_token', accessToken);
      state.username = user.username;
      state.id = user.id;
      state.email = user.email;
      state.isActivated = user.isActivated;
      state.isLogedIn = true;
    },
    logOut: (state) => {
      localStorage.removeItem('access_token');
      state.username = null;
      state.id = null;
      state.email = null;
      state.isActivated = false;
      state.isLogedIn = false;
    },
  },
});

export const { setCredentials, logOut } = userSlice.actions;
export default userSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.user.username;
export const selectCurrentID = (state: RootState) => state.user.id;
export const selectIsLogedIn = (state: RootState) => state.user.isLogedIn;
