import { ValidationChain, body } from 'express-validator';
import { usernameExceptions } from '#config/index.js';

export function registerMiddleware(): ValidationChain[] {
  return [
    body('username')
      .isLength({ min: 3, max: 15 })
      .matches(/^[\w\-А-яЁё]+$/)
      .not()
      .isIn(usernameExceptions),
    body('password').isLength({ min: 8, max: 32 }),
    body('passwordConfirmation').custom((value, { req }) => {
      return value === req.body.password;
    }),
    body('email').isEmail(),
  ];
}
