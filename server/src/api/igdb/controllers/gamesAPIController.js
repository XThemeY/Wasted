import 'dotenv/config';
import axios from 'axios';
import logEvents from '../../../middleware/logEvents.js';

const axiosGame = axios.create({
  baseURL: process.env.IGDB_API_URL,
});
//igdbAuth();

class IgdbGameAPI {
  async getGame(req, res, next) {
    const gameId = req.params.id;
    const data = req.body.data;
    try {
      const response = await axiosGame.post('/games/', data);

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
    const data = req.body.data;
    try {
      const response = await axiosGame.get('/search/', data);

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

async function igdbAuth() {
  try {
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_TOKEN}&grant_type=client_credentials`,
    );
    const token = response.data.access_token;
    axiosGame.defaults.headers.common['Client-ID'] = process.env.IGDB_CLIENT_ID;
    axiosGame.defaults.headers.common['Accept'] = 'application/json';
    axiosGame.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Авторизация успешна');
  } catch (error) {
    logEvents(
      `${'Ошибка авторизации на IGDB -' + error?.name || error}: ${error?.message || error}`,
      'gameReqLog.log',
    );
    console.log(`Ошибка авторизации на IGDB`, error?.message || error);
  }
}
