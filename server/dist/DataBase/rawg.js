import { get } from "axios";
import { writeFileSync } from "fs";
const apiKey = "56dc624a6e2e49d1bd29144a5c1e7af7";
const baseUrl = "https://api.rawg.io/api";
let page = 1;
let page_size = 20;
let allGames = [];
async function fetchAllGames() {
    try {
        while (page < 6) {
            const response = await get(`${baseUrl}/games`, {
                params: {
                    key: apiKey,
                    page: page,
                    page_size: page_size,
                    dates: "2018-01-01,2023-12-01",
                    ordering: "-added",
                },
            });
            const games = response.data.results;
            allGames = allGames.concat(games);
            page++;
            console.log("GamePage = ", page);
        }
        writeFileSync("../games.json", JSON.stringify(allGames, null, 2));
        console.log("База игр скачана");
    }
    catch (error) {
        console.error("Error fetching all games:", error.message);
    }
}
// Вызови функцию для получения всех фильмов
export default fetchAllGames;
//# sourceMappingURL=rawg.js.map