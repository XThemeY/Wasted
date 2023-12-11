const Router = require("express");
const router = new Router();
const controller = require("../controllers/dbController");

// controller.addItem(897087);

router.get("/\\d*", controller.getGame);

module.exports = router;
