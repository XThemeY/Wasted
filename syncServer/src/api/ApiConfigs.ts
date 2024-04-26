import axios, { AxiosInstance } from 'axios';

export const tmdbApiConfig = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.TMDB_API_URL,
  });
  instance.defaults.headers.common['Authorization'] =
    `Bearer ${process.env.TMDB_API_TOKEN}`;
  return instance;
};
