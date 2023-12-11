const Router = require("express");
const router = new Router();
const controller = require("../controllers/dbController");

// controller.addMovie(1);

router.get("/\\d*", controller.getMovie);

module.exports = router;
