import Router from "express";
const router = new Router();
import { userController } from "../controllers/index.js";
router.get("/users", userController.getUserAll);
router.get("/:login", userController.getUser);
export default router;
//# sourceMappingURL=userRouter.js.map