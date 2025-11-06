import { UserService } from "@/modules/users/user.service";
import { LoginSchema, SignUpSchema } from "@/types/auth.type";
import { COOKIE } from "@/core/types/base.type";
import { UserFilterSchema } from "@/types/user.type";
import { getUserCookie, setCookie } from "@/utils/cookie";
import type { Request, Response, NextFunction } from "express";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getUsers();
      res.json({ data: users });
    } catch (error) {
      next(error);
    }
  };

  public paginateUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const filter = UserFilterSchema.parse(req.query);
      const users = await this.userService.paginateUsers(filter);
      res.json({ data: users });
    } catch (error) {
      next(error);
    }
  };

  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = SignUpSchema.parse(req.body);
      const user = await this.userService.signup(validated);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  public getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = getUserCookie(req);
      const auth = await this.userService.getMe(sessionToken);
      res.json({ data: auth });
    } catch (error) {
      next(error);
    }
  };

  public userLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validated = LoginSchema.parse(req.body);
      const user = await this.userService.signin(validated);
      setCookie(res, COOKIE.USER, user.token);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  };
}
