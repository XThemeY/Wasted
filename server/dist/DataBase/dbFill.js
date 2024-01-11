import Movie from "../../models/movie/Movie.js";
import TVShow from "../../models/tvShow/TVShow.js";
import Game from "../../models/game/Game.js";
import Episode from "../../models/tvShow/Episode.js";
import { readFileSync } from "fs";
export default class dbController {
    async fillMovieDB() {
        try {
            const file = JSON.parse(readFileSync("./DataBase/movies.json", "utf8"));
            file.forEach(async (element) => {
                const genre = () => {
                    let genreStr = [];
                    element.genres.forEach((item) => {
                        genreStr.push(item.genre);
                    });
                    return genreStr;
                };
                const country = () => {
                    let countriesStr = [];
                    element.countries.forEach((item) => {
                        countriesStr.push(item.country);
                    });
                    return countriesStr;
                };
                const movie = new Movie({
                    title: element.nameRu,
                    originalTitle: element.nameOriginal,
                    posterUrl: element.posterUrl,
                    releaseDate: element.year,
                    genres: genre(),
                    countries: country(),
                    director: ["Джон Доу"],
                    cast: ["Джон Доу", "Джон Доу", "Джон Доу"],
                    description: "Описание",
                    ratings: {
                        imdb: element.ratingImdb,
                        kinopoisk: element.ratingKinopoisk,
                    },
                });
                await movie.save();
            });
            console.log("Фильмы добавлены в базу данных");
        }
        catch (error) {
            console.error("Error fetching:", error.message);
        }
    }
    async filltvShowDB() {
        try {
            const file = JSON.parse(readFileSync("./DataBase/tv-shows.json", "utf8"));
            file.forEach(async (element) => {
                const genre = () => {
                    let genreStr = [];
                    element.genres.forEach((item) => {
                        genreStr.push(item.genre);
                    });
                    return genreStr;
                };
                const country = () => {
                    let countriesStr = [];
                    element.countries.forEach((item) => {
                        countriesStr.push(item.country);
                    });
                    return countriesStr;
                };
                const tvshow = new TVShow({
                    title: element.nameRu,
                    originalTitle: element.nameOriginal !== null ? element.nameOriginal : "",
                    posterUrl: element.posterUrl,
                    startDate: element.year,
                    genres: genre(),
                    countries: country(),
                    director: ["Джон Доу"],
                    cast: ["Джон Доу", "Джон Доу", "Джон Доу"],
                    description: "Описание",
                    ratings: {
                        imdb: element.ratingImdb,
                        kinopoisk: element.ratingKinopoisk,
                    },
                });
                await tvshow.save();
            });
            console.log("Сериалы добавлены в базу данных");
        }
        catch (error) {
            console.error("Error fetching:", error.message);
        }
    }
    async fillGameDB() {
        try {
            const file = JSON.parse(readFileSync("./DataBase/games.json", "utf8"));
            file.forEach(async (element) => {
                const genres = () => {
                    let genreStr = [];
                    element.genres.forEach((item) => {
                        genreStr.push(item.name);
                    });
                    return genreStr;
                };
                const platforms = () => {
                    let platformStr = [];
                    element.platforms.forEach((item) => {
                        platformStr.push(item.platform.name);
                    });
                    return platformStr;
                };
                const tags = () => {
                    let tagStr = [];
                    element.tags.forEach((item) => {
                        tagStr.push(item.name);
                    });
                    return tagStr;
                };
                const game = new Game({
                    title: element.name,
                    posterUrl: element.background_image,
                    releaseDate: element.released,
                    genres: genres(),
                    platforms: platforms(),
                    developer: ["Джон Доу"],
                    description: "Описание",
                    tags: tags(),
                    duration: element.playtime,
                    ratings: {
                        rawg: element.rating,
                        metacritic: element.metacritic,
                    },
                });
                await game.save();
            });
            console.log("Игры добавлены в базу данных");
        }
        catch (error) {
            console.error("Error fetching:", error.message);
        }
    }
}
export async function fillEpisodesDB() {
    for (let i = 1; i < 11; i++) {
        const show = await TVShow.findOne({ id: i });
        for (let y = 1; y < 11; y++) {
            const episode = new Episode({
                TVShowId: show._id,
                seasonNumber: i > 5 ? 2 : 1,
                episodeNumber: i,
                title: "Название эпизода",
                duration: 45,
                releaseDate: "10.10.2022",
                description: "Описание",
            });
            await episode.save();
        }
    }
    console.log("Эпизоды добавлены в базу данных");
}
//# sourceMappingURL=dbFill.js.map