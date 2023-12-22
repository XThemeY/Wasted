import Router from "express";
const router = new Router();
import { movieController } from "../controllers/index.js";

// controller.addMovie(1);

router.get("/", movieController.getMovieAll);
router.get("/:id", movieController.getMovie);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);

export default router;
