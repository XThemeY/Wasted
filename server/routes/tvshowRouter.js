import Router from "express";
const router = new Router();
import { tvShowController } from "../controllers/index.js";

router.get("/", tvShowController.getTVShowAll);
router.get("/:id", tvShowController.getTVShow);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);
// router.get("/:id", controller.getMovie);

export default router;
