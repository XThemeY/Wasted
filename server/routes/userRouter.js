import Router from "express";
const router = new Router();
import { userController } from "../controllers/controllers.js";

router.get("/users", userController.getUserAll);
router.get("/:login", userController.getUser);

export default router;
