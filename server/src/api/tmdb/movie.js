import 'dotenv/config';
import axios from 'axios';
import Router from 'express';
const router = Router();
router.get('/movie/:id(\\d+)/', getMovie);
router.get('/keywords', getKeyWords);
import MovieService from '../../services/movieService.js';

//https://rating.kinopoisk.ru/456.xml

axios.defaults.headers.common['Authorization'] =
  `Bearer ${process.env.TMDB_API_TOKEN}`;

async function getMovie(req, res, next) {
  const response = await axios.get(
    process.env.TMDB_API_URL +
      '/movie/' +
      req.params.id +
      '?language=ru-RU&append_to_response=keywords,credits,images&include_image_language=ru,en',
  );

  const responseENG = await axios.get(
    process.env.TMDB_API_URL + '/movie/' + req.params.id + '?language=en-US',
  );
  await MovieService.addMovieToDb(response.data, responseENG.data);
  res.json(response.data);
}

async function getKeyWords(req, res, next) {
  let arr = [];

  for (let index = 0; index < 300; index++) {
    try {
      const response = await axios.get(
        process.env.TMDB_API_URL + '/keyword/' + index,
      );
      arr.push(response.data);
      console.log('Success = ', index);
    } catch (error) {
      console.log('Error = ', index);
    }
  }

  res.json(arr);
}

export default router;
