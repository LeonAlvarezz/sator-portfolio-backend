import { AdminService } from "@/modules/admin/admin.service";
import { AssignAdminRoleSchema } from "@/types/admin.type";
import { LoginSchema, SignUpSchema, UpdateTotpSchema } from "@/types/auth.type";
import { getAdminCookie } from "@/utils/cookie";
import {
  ThrowInternalServer,
  ThrowUnauthorized,
} from "@/core/response/error/errors";
import type { Request, Response, NextFunction } from "express";

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
      const validated = LoginSchema.parse(req.body);
      const admin = await this.adminService.login(res, validated);
      res.json({ data: admin });
    } catch (error) {
      next(error);
    }
  };

  public signout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = getAdminCookie(req);
      const result = await this.adminService.signout(token);
      if (!result) {
        return ThrowInternalServer();
      }
      res.json({
        data: "Successfully Sign Out",
      });
    } catch (error) {
      next(error);
    }
  };

  public getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = getAdminCookie(req);
      if (!sessionToken) {
        return ThrowUnauthorized();
      }
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
      const token = getAdminCookie(req);
      const admin = await this.adminService.UpdateTotp(token, validated);
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
