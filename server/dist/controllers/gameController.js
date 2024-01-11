import { Game } from "../models/index.js";
const excludeFieldsStr = "-_id -__v -countries._id";
class gameController {
    async getGame(req, res) {
        try {
            const id = req.params.id;
            const game = await Game.findOne({ id: id }).select(excludeFieldsStr);
            if (!game) {
                return res.status(400).json({
                    message: `Неправильный адрес`,
                });
            }
            res.json(game);
        }
        catch (e) { }
    }
    async getGameAll(req, res) {
        try {
            const games = await Game.find({}).select(excludeFieldsStr);
            const totalCount = await Game.countDocuments({});
            if (!games) {
                return res.status(400).json({
                    message: `Неправильный адрес`,
                });
            }
            const response = { items: games, total_items: totalCount };
            res.json(response);
        }
        catch (e) {
            res.status(500).send(e);
        }
    }
}
export default new gameController();
//# sourceMappingURL=gameController.js.map