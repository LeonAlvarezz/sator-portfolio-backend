import { UnauthorizedException } from "@/core/response/error/exception";
import { SiteUserService } from "@/modules/site-user/site-user.service";
import { StatisticService } from "@/services/statistic.service";
import { cookie, COOKIE_ENTITY } from "@/libs/cookie";
import type { NextFunction, Response, Request } from "express";

export class StatisticController {
  private statisticService: StatisticService;
  private siteUserService: SiteUserService;
  constructor() {
    this.statisticService = new StatisticService();
    this.siteUserService = new SiteUserService();
  }
  public getTotalPortfolioMetric = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sessionToken = cookie.get(req, COOKIE_ENTITY.SITE_USER);
      const siteUser = await this.siteUserService.getMe(sessionToken);
      if (!siteUser) throw new UnauthorizedException();
      const metric = await this.statisticService.getSiteUserTotalMetric(
        siteUser.id as string
      );
      res.json({
        data: metric,
      });
    } catch (error) {
      next(error);
    }
  };
  public getDailyPortfolioMetric = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sessionToken = cookie.get(req, COOKIE_ENTITY.SITE_USER);
      const siteUser = await this.siteUserService.getMe(sessionToken);
      if (!siteUser) throw new UnauthorizedException();
      const metric = await this.statisticService.getSiteUserDailyMetric(
        siteUser.id as string
      );
      res.json({
        data: metric,
      });
    } catch (error) {
      next(error);
    }
  };
}
