const Router = require("express");
const router = new Router();
const controller = require("../controllers/authController");
const { check } = require("express-validator");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/registration",
  [
    check("username", "Имя пользователя не может быть пустым").notEmpty(),
    check("password", "Пароль должен содержать минимум 6 символов")
      .notEmpty()
      .isLength({ min: 8, max: 15 }),
    check("login", "Логин не может быть пустым").notEmpty(),
    check("mail", "Почта не может быть пустым").notEmpty().isEmail(),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get(
  "/users",
  roleMiddleware(["Admin", "Moderator"]),
  controller.getUsers
);

module.exports = router;
