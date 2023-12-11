const Game = require("../models/Game");
const Movie = require("../models/Movie");
const TVShow = require("../models/TVShow");
const fs = require("fs");

class dbController {
  async getMovie(req, res) {
    try {
      const id = req.url.slice(1);
      const movie = await Movie.findOne({ id: id });

      if (!movie) {
        return res.status(400).json({
          message: `Неправильный адрес`,
        });
      }
      res.json(movie);
    } catch (e) {}
  }

  async getGame(req, res) {
    try {      
      const id = req.url.slice(1);
      const game = await Game.findOne({ id: id });

      if (!game) {
        return res.status(400).json({
          message: `Неправильный адрес`,
        });
      }
      res.json(game);
    } catch (e) {}
  }

  async getTVShow(req, res) {
    try {      
      const id = req.url.slice(1);
      const tvShow = await TVShow.findOne({ id: id });

      if (!tvShow) {
        return res.status(400).json({
          message: `Неправильный адрес`,
        });
      }
      res.json(tvShow);
    } catch (e) {}
  }

  async addMovie(id) {
    try {
      const file = JSON.parse(fs.readFileSync("../movies.json", "utf8"));

      file.forEach(async (element) => {
        const movie = new Movie({
          id: element.kinopoiskId,
          title: element.nameRu,
          originalTitle: element.nameOriginal,
          poster: element.posterUrl,
          runtime: 123,
          releaseDate: element.year,
          description: "Описание",
          countries: element.countries,
          ratings: {
            imdb: element.ratingImdb,
            kinopoisk: element.ratingKinopoisk,
          },
          status: "InProgress",
        });
        await movie.save();
      });

      console.log("Элемент добавлен в базу данных");
    } catch (error) {
      console.error("Error fetching:", error.message);
    }
  }

  // async addTVShow(id) {
  //   try {
  //     const tvShow = new TVShow({
  //       id: id,
  //       title: movieData.title,
  //       originalTitle: movieData.original_title,
  //     });
  //     await tvShow.save();

  //     console.log("Элемент добавлен в базу данных");
  //   } catch (error) {
  //     console.error("Error fetching:", error.message);
  //   }
  // }

  // async addGame(id) {
  //   try {
  //     const game = new Game({
  //       id: id,
  //       title: gameData.title,
  //       originalTitle: movieData.original_title,
  //     });
  //     await game.save();

  //     console.log("Элемент добавлен в базу данных");
  //   } catch (error) {
  //     console.error("Error fetching:", error.message);
  //   }
  // }

  async deleteItem() {}

  async updateItem() {}
}

module.exports = new dbController();

// const tvShow = new TVShow({
//   username: username,
//   login: login,
//   mail: mail,
//   password: hashPassword,
//   roles: [userRole.role],
// });
// await tvShow.save();

// const game = new Game({
//   username: username,
//   login: login,
//   mail: mail,
//   password: hashPassword,
//   roles: [userRole.role],
// });
// await game.save();
