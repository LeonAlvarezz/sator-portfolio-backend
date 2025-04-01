import { UserService } from "@/services/user.service";
import { LoginSchema, SignUpSchema } from "@/types/auth.type";
import { COOKIE } from "@/types/base.type";
import { UserFilterSchema } from "@/types/user.type";
import { deleteCookie, getUserCookie, setCookie } from "@/utils/cookie";
import {
  ThrowForbidden,
  ThrowInternalServer,
  ThrowUnauthorized,
} from "@/utils/exception";
import { RequestCounter } from "@/utils/request_counter";
import type { Request, Response, NextFunction } from "express";

export class UserController {
  private userService: UserService;
  private requestCounter: RequestCounter;

  constructor() {
    this.userService = new UserService();
    this.requestCounter = new RequestCounter();
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
      const token = getUserCookie(req);
      const user = await this.userService.signup(token, validated);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  public getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("===YOU ARE HITTING THIS ENDPOINT===");
      const sessionToken = getUserCookie(req);
      if (!sessionToken) {
        return ThrowUnauthorized();
      }

      const key = "getMe";
      this.requestCounter.log(key);

      const auth = await this.userService.getMe(sessionToken);
      res.json({ data: auth });
    } catch (error) {
      next(error);
    }
  };

  public anonymousLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sessionToken = getUserCookie(req);
      if (sessionToken) {
        return ThrowForbidden("User already have an account");
      }
      const user = await this.userService.anonymousLogin();
      setCookie(res, COOKIE.USER, user.token);
      res.json({ data: user });
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
      const user = await this.userService.login(validated);
      setCookie(res, COOKIE.USER, user.token);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  public signout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // deleteCookie(res, COOKIE.USER);
      const token = getUserCookie(req);
      const result = await this.userService.signout(token);
      if (!result) return ThrowInternalServer();
      deleteCookie(res, COOKIE.USER);
      res.json({
        data: "Successfully Sign Out",
      });
    } catch (error) {
      next(error);
    }
  };
}
