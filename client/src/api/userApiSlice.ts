import { apiSlice } from '@/store/slices/';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: '/users',
        method: 'GET',
        // params: {
        //   _limit: limit,
        // },
      }),
    }),
  }),
});

export const { useGetAllUsersQuery } = userApiSlice;
