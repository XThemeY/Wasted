import Router from "express";
const router = new Router();
import { authController } from "../controllers/index.js";
import { check } from "express-validator";

router.post(
  "/registration",
  [
    check("username", "Имя пользователя не может быть пустым").notEmpty(),
    check("password", "Пароль должен содержать минимум 8 символов")
      .notEmpty()
      .isLength({ min: 8, max: 15 }),
    check("login", "Логин не может быть пустым, максимум 25 символов")
      .notEmpty()
      .isLength({ max: 25 }),
    check("email", "Почта не может быть пустой").notEmpty().isEmail(),
  ],
  authController.registration
);
router.post("/login", authController.login);

export default router;
