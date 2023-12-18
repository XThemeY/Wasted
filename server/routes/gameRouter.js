import Router from "express";
const router = new Router();
import { gameController } from "../controllers/controllers.js";

// controller.addMovie(1);

router.get("/", gameController.getGameAll);
router.get("/:id", gameController.getGame);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);

export default router;
