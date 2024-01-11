import { TVShow } from "../models/index.js";
const excludeFieldsStr = "-_id -__v -countries._id";
class tvShowController {
    async getTVShow(req, res) {
        try {
            const id = req.params.id;
            const tvShow = await TVShow.findOne({ id: id }).select(excludeFieldsStr);
            if (!tvShow) {
                return res.status(400).json({
                    message: `Неправильный адрес`,
                });
            }
            res.json(tvShow);
        }
        catch (e) { }
    }
    async getTVShowAll(req, res) {
        try {
            const tvShows = await TVShow.find({}).select(excludeFieldsStr);
            const totalCount = await TVShow.countDocuments({});
            if (!tvShows) {
                return res.status(400).json({
                    message: `Неправильный адрес`,
                });
            }
            const response = { items: tvShows, total_items: totalCount };
            res.json(response);
        }
        catch (e) {
            res.status(500).send(e);
        }
    }
}
export default new tvShowController();
//# sourceMappingURL=tvShowController.js.map