import 'dotenv/config';
import axios from 'axios';
import logEvents from '../../../middleware/logEvents.js';

let token = '';
igdbAuth();

axios.defaults.baseURL = process.env.RAWG_API_URL;
axios.defaults.headers.common['Client-ID'] = process.env.IGDB_CLIENT_ID;
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

class IgdbGameAPI {
  async getGame(req, res, next) {
    const gameId = req.params.id;

    try {
      const response = await axios.get('/games/' + gameId);

      //await MovieService.addMovieToDb(response.data, responseENG.data);

      res.json(response.data);
    } catch (error) {
      logEvents(
        `${'id:' + gameId + '-' + error?.name || error}: ${error?.message || error}`,
        'gameReqLog.log',
      );
      console.log(`ID:${gameId} Ошибка запроса игры`, error?.message || error);
    }
  }

  async searchGames(req, res, next) {
    const search = req.params.search || '';

    try {
      const response = await axios.get(
        process.env.RAWG_API_URL +
          '/games?dates=2023-01-01,2023-12-31&ordering=-added',
      );

      //await MovieService.addMovieToDb(response.data, responseENG.data);

      res.json(response.data);
    } catch (error) {
      logEvents(
        `${'По запросу:' + search + '-' + error?.name || error}: ${error?.message || error}`,
        'gameReqLog.log',
      );
      console.log(
        `Запрос:${search} Ошибка запроса игры`,
        error?.message || error,
      );
    }
  }
}
export default new IgdbGameAPI();

function igdbAuth() {
  axios
    .post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_TOKEN}&grant_type=client_credentials`,
    )
    .then((response) => {
      token = response.data.access_token;
      console.log('Авторизация успешна');
    })
    .catch((error) => {
      logEvents(
        `${'Ошибка авторизации на IGDB -' + error?.name || error}: ${error?.message || error}`,
        'gameReqLog.log',
      );
      console.log(`Ошибка авторизации на IGDB`, error?.message || error);
    });
}
