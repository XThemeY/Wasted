import { apiSlice } from '@/store/slices/';
import { IAuthRes } from '@/types';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IAuthRes, { login: string; password: string }>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: { ...data },
      }),
    }),
    checkLogin: builder.query<IAuthRes, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET',
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: '/auth/registration',
        method: 'POST',
        body: { ...data },
      }),
    }),
    logout: builder.mutation({
      query: (data) => ({
        url: '/auth/logout',
        method: 'POST',
        body: { ...data },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useCheckLoginQuery,
} = authApiSlice;
