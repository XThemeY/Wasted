import { get } from "axios";
import { writeFileSync } from "fs";
const apiKey = "3e222cdc-d99a-4040-9694-714b71501f07";
const baseUrl = "https://kinopoiskapiunofficial.tech/api/v2.2";
let page = 1;
let allShows = [];
async function fetchAllMovies() {
    try {
        while (page < 2) {
            const response = await get(`${baseUrl}/films/collections?type=TOP_250_TV_SHOWS&page=${page}`, {
                headers: {
                    "X-API-KEY": apiKey,
                    "Content-Type": "application/json",
                },
            });
            const movies = response.data.items;
            allShows = allShows.concat(movies);
            page++;
            console.log("MoviePage = ", page);
        }
        writeFileSync("../tv-shows.json", JSON.stringify(allShows, null, 2));
        console.log("База сериалов скачана");
    }
    catch (error) {
        console.error("Error fetching all movies:", error.message);
    }
}
// Вызови функцию для получения всех фильмов
export default fetchAllMovies;
//# sourceMappingURL=kinopoisk.js.map