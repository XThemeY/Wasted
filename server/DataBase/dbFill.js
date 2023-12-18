const Game = require("../models/Game");
const Movie = require("../models/Movie");
const TVShow = require("../models/TVShow").default;
const fs = require("fs");

class dbController {
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
