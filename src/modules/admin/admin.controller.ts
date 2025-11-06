import { AdminService } from "@/modules/admin/admin.service";
import { AssignAdminRoleSchema } from "@/types/admin.type";
import type { Request, Response, NextFunction } from "express";
import { SigninSchema } from "../auth/dto/sign-in.dto";
import { UpdateTotpSchema } from "../auth/dto/update-totp.dto";
import { SignUpSchema } from "../auth/dto/sign-up.dto";
import { cookie, COOKIE_ENTITY } from "@/libs/cookie";

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  public getAdmins = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const admins = await this.adminService.getAdmins();
      res.json({ data: admins });
    } catch (error) {
      return next(error);
    }
  };

  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = SignUpSchema.parse(req.body);
      const admin = await this.adminService.signUp(validated);
      res.json({ data: admin });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = SigninSchema.parse(req.body);
      const admin = await this.adminService.signin(validated);
      cookie.set(res, COOKIE_ENTITY.ADMIN, admin.token);
      res.success(admin);
    } catch (error) {
      next(error);
    }
  };

  public signout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = cookie.get(req, COOKIE_ENTITY.ADMIN);
      await this.adminService.signout(token);
      res.json({
        data: "Successfully Sign Out",
      });
    } catch (error) {
      next(error);
    }
  };

  public getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookie.get(req, COOKIE_ENTITY.ADMIN);
      const auth = await this.adminService.getMe(sessionToken);
      res.json({ data: auth });
    } catch (error) {
      next(error);
    }
  };

  public updateTotp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validated = UpdateTotpSchema.parse(req.body);
      const token = cookie.get(req, COOKIE_ENTITY.ADMIN);
      const admin = await this.adminService.updateTotp(token, validated);
      res.json({ data: admin });
    } catch (error) {
      next(error);
    }
  };

  public assignRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validated = AssignAdminRoleSchema.parse(req.body);
      const admin = await this.adminService.assignRole(validated);
      res.json({ data: admin });
    } catch (error) {
      next(error);
    }
  };
}
