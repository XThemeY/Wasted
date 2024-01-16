import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';
import { IUserState } from '@/types/interfaces/IUser';

const initialState: IUserState = {
  isLogedIn: false,
  username: '',
  avatarURL: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setAvatarUrl: (state, action: PayloadAction<string>) => {
      state.avatarURL = action.payload;
    },

    loginToAccount: (state) => {
      state.isLogedIn = true;
    },
  },
});

export const { setUsername, setAvatarUrl, loginToAccount } = userSlice.actions;
export default userSlice.reducer;

export const selectAvatarURL = (state: RootState) => state.user.avatarURL;
export const selectUsername = (state: RootState) => state.user.username;
