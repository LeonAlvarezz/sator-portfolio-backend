import { env } from "@/libs";
import { PortfolioService } from "@/services/portfolio.service";
import {
  BaseModelSchema,
  IdentityRole,
  ValidatedSlugSchema,
} from "@/core/types/base.type";
import {
  CreatePortfolioSchema,
  PortfolioFilterSchema,
} from "@/types/portfolio.type";
import type { NextFunction, Response, Request } from "express";
import { UnauthorizedException } from "@/core/response/error/exception";
import { cookie, COOKIE_ENTITY } from "@/libs/cookie";

export class PortfolioController {
  private portfolioService: PortfolioService;
  constructor() {
    this.portfolioService = new PortfolioService();
  }

  public getAllPublishedSlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const key = req.headers.authorization?.split(" ")[1];
      if (!key) throw new UnauthorizedException();
      const resources = await this.portfolioService.getAllSlugBySiteUser(key);
      res.json({ data: resources });
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resources = await this.portfolioService.findAll();
      res.json({ data: resources });
    } catch (error) {
      next(error);
    }
  };

  public getPortfolioBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validatedSlug = ValidatedSlugSchema.parse({
        slug: req.params.slug,
      });
      const portfolio = await this.portfolioService.getBySlug(
        validatedSlug.slug
      );
      res.json({ data: portfolio });
    } catch (error) {
      next(error);
    }
  };

  public getPublishedPortfolioBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validatedSlug = ValidatedSlugSchema.parse({
        slug: req.params.slug,
      });
      const portfolio = await this.portfolioService.getPublishedBySlug(
        validatedSlug.slug
      );
      res.json({ data: portfolio });
    } catch (error) {
      next(error);
    }
  };

  public paginateByAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const filter = PortfolioFilterSchema.parse(req.query);
      const portfolios = await this.portfolioService.paginateByAdmin(filter);
      res.json({
        data: portfolios,
      });
    } catch (error) {
      next(error);
    }
  };

  public paginateBySiteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const filter = PortfolioFilterSchema.parse(req.query);
      const portfolios = await this.portfolioService.paginateBySiteUser(
        req,
        filter
      );
      res.json({
        data: portfolios,
      });
    } catch (error) {
      next(error);
    }
  };

  public paginateBySiteUserApiKey = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const key = req.headers.authorization?.split(" ")[1];
      if (!key) throw new UnauthorizedException();
      const filter = PortfolioFilterSchema.parse(req.query);
      const portfolios = await this.portfolioService.paginateBySiteUserApiKey(
        key,
        filter
      );
      res.json({
        data: portfolios,
      });
    } catch (error) {
      next(error);
    }
  };

  public createPortfolio = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validated = CreatePortfolioSchema.parse(req.body);
      const role = req.originalUrl.startsWith(`${env.API_PREFIX}/admin`)
        ? IdentityRole.ADMIN
        : IdentityRole.SITE_USER;
      const token =
        role === IdentityRole.ADMIN
          ? cookie.get(req, COOKIE_ENTITY.ADMIN)
          : cookie.get(req, COOKIE_ENTITY.SITE_USER);
      const portfolio = await this.portfolioService.create(
        token,
        validated,
        role
      );
      res.json({ data: portfolio });
    } catch (error) {
      next(error);
    }
  };

  public updatePortfolio = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const params = BaseModelSchema.parse({
        id: req.params.id,
      });
      const validated = CreatePortfolioSchema.parse(req.body);
      const role = req.originalUrl.startsWith(`${env.API_PREFIX}/admin`)
        ? IdentityRole.ADMIN
        : IdentityRole.SITE_USER;
      const token =
        role === IdentityRole.ADMIN
          ? cookie.get(req, COOKIE_ENTITY.ADMIN)
          : cookie.get(req, COOKIE_ENTITY.SITE_USER);
      const portfolio = await this.portfolioService.update(
        token,
        params.id as string,
        validated,
        role
      );
      res.json({ data: portfolio });
    } catch (error) {
      next(error);
    }
  };
  public deletePortfolio = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const params = BaseModelSchema.parse({
        id: req.params.id,
      });
      const portfolio = await this.portfolioService.delete(params.id as string);
      res.json({ data: portfolio });
    } catch (error) {
      next(error);
    }
  };

  public publishPortfolio = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const params = BaseModelSchema.parse({
        id: req.params.id,
      });
      const portfolio = await this.portfolioService.publish(
        params.id as string
      );
      res.json({ data: portfolio });
    } catch (error) {
      next(error);
    }
  };
  public unpublishPortfolio = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const params = BaseModelSchema.parse({
        id: req.params.id,
      });
      const portfolio = await this.portfolioService.unpublish(
        params.id as string
      );
      res.json({ data: portfolio });
    } catch (error) {
      next(error);
    }
  };
  public increaseView = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const key = req.headers.authorization?.split(" ")[1];
      if (!key) throw new UnauthorizedException();
      const params = ValidatedSlugSchema.parse({
        slug: req.params.slug,
      });
      await this.portfolioService.increaseView(key, params.slug);
      res.simpleSuccess();
    } catch (error) {
      next(error);
    }
  };
}
