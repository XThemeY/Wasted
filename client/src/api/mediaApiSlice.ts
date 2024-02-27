import { apiSlice } from '@/store/slices/';

export const mediaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNewMedia: builder.query({
      query: () => {
        return {
          url: '/',
          method: 'GET',
        };
      },
    }),
  }),
});

export const { useGetNewMediaQuery } = mediaApiSlice;
