import ApiError from '#utils/apiError';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export const tmdbApiConfig = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.TMDB_API_URL,
  });
  instance.defaults.headers.common['Authorization'] =
    `Bearer ${process.env.TMDB_API_TOKEN}`;
  return instance;
};

class RequestHandler {
  private _axiosMedia = tmdbApiConfig();
  private _reqConfig =
    '&append_to_response=keywords,credits,images&include_image_language=ru,en';
  private _reqEngConfig = '?language=en-US';
  private _reqRuConfig = '?language=ru-RU';
  private _reqPopularConfig = '&sort_by=popularity.desc&vote_count.gte=100';
  public async reqMedia(
    type: string,
    id: string | number,
    eng: boolean = false,
    config: boolean = true,
  ): Promise<AxiosResponse> {
    const langConfig = eng ? this._reqEngConfig : this._reqRuConfig;
    const url =
      `/${type}/` + id + langConfig + `${config ? this._reqConfig : ''}`;
    try {
      const response = await this._axiosMedia.get(url);
      return response;
    } catch (error) {
      throw ApiError.BadRequest(
        `Ошибка запроса "${url}"`,
        error?.message || error,
      );
    }
  }

  public async reqLatestMedia(type: string): Promise<AxiosResponse> {
    const url = `/${type}/` + 'latest';
    try {
      const response = await this._axiosMedia.get(url);
      return response;
    } catch (error) {
      throw ApiError.BadRequest(
        `Ошибка запроса "${url}"`,
        error?.message || error,
      );
    }
  }

  public async reqPopularMedia(
    type: string,
    page: number,
  ): Promise<AxiosResponse> {
    const url =
      `/discover/${type}` +
      this._reqRuConfig +
      '&page=' +
      page +
      this._reqPopularConfig;
    try {
      const response = await this._axiosMedia.get(url);
      return response;
    } catch (error) {
      throw ApiError.BadRequest(
        `Ошибка запроса "${url}"`,
        error?.message || error,
      );
    }
  }
}

export default new RequestHandler();
