import ApiError from '#/utils/apiError';
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
  private axiosMedia = tmdbApiConfig();
  private reqConfig =
    '?language=ru-RU&append_to_response=keywords,credits,images&include_image_language=ru,en';

  public async reqMedia(
    type: string,
    id: string | number,
    eng: boolean = false,
    config: boolean = true,
  ): Promise<AxiosResponse> {
    if (eng) {
      this.reqConfig = '?language=en-US';
    }
    try {
      const response = await this.axiosMedia.get(
        `/${type}/` + id + `${config ? this.reqConfig : ''}`,
      );

      return response;
    } catch (error) {
      throw ApiError.BadRequest(
        `Ошибка запроса "${'/' + type + '/' + id + this.reqConfig}"`,
        error?.message || error,
      );
    }
  }

  public async reqLatestMedia(type: string): Promise<AxiosResponse> {
    try {
      const response = await this.axiosMedia.get(`/${type}/` + 'latest');
      return response;
    } catch (error) {
      throw ApiError.BadRequest(
        `Ошибка запроса "${'/' + type + '/' + 'latest'}"`,
        error?.message || error,
      );
    }
  }
}

export default new RequestHandler();
