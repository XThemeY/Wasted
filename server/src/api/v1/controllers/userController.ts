import { userService } from '#services/index.js';
import ApiError from '#utils/apiError.js';
import { UserDto } from '#utils/dtos';
import type { Request, Response, NextFunction } from 'express';

class UserController {
  async getUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<UserDto> | void> {
    try {
      const username = req.params.username;
      const user = await userService.getUser(username);

      return res.json(new UserDto(user));
    } catch (e) {
      next(e);
    }
  }

  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<UserDto> | void> {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getUserSettings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<UserDto> | void> {
    try {
      const nickname = req.params.username;
      const options = await userService.getUserSettings(nickname);
      return res.json(options);
    } catch (e) {
      next(e);
    }
  }

  async setUserSettings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<UserDto> | void> {
    try {
      const username = req.params.username;
      const body = req.body;

      if (!body) {
        return next(ApiError.BadRequest());
      }
      const settings = await userService.setUserSettings(username, body);
      return res.json(settings);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
