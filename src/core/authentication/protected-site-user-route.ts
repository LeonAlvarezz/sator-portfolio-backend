import type { Request, Response, NextFunction } from "express";
import { SiteUserService } from "@/modules/site-user/site-user.service";
import { UnauthorizedException } from "../response/error/exception";
import { cookie, COOKIE_ENTITY } from "@/libs/cookie";

type ProtectedRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

function protectedSiteUserRoute(handler: ProtectedRouteHandler) {
  const siteUserService = new SiteUserService();

  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const sessionToken = cookie.get(req, COOKIE_ENTITY.SITE_USER);
      if (!sessionToken) throw new UnauthorizedException();
      const siteUser = await siteUserService.getMe(sessionToken);
      if (!siteUser) throw new UnauthorizedException();
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export default protectedSiteUserRoute;
