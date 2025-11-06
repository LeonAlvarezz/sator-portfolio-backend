import { FormAttemptService } from "@/services/form-attempt.service";
import { BaseModelSchema } from "@/core/types/base.type";
import {
  CreateFormAttemptSchema,
  FormAttemptFilterSchema,
} from "@/types/portfolio-form.type";
import { cookie, COOKIE_ENTITY } from "@/libs/cookie";
import type { Request, Response, NextFunction } from "express";
import { ForbiddenException } from "@/core/response/error/exception";

export class FormAttemptController {
  private formAttemptService: FormAttemptService;
  constructor() {
    this.formAttemptService = new FormAttemptService();
  }

  public findByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = cookie.get(req, COOKIE_ENTITY.USER);
      if (!token) throw new ForbiddenException();
      const data = await this.formAttemptService.findByUser(token);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  };
  public paginateByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = cookie.get(req, COOKIE_ENTITY.USER);
      if (!token) throw new ForbiddenException();
      const filter = FormAttemptFilterSchema.parse(req.query);
      const data = await this.formAttemptService.paginateByUser(token, filter);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  };
  public getAttemptById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validated = BaseModelSchema.parse(req.params);
      const token = cookie.get(req, COOKIE_ENTITY.USER);
      if (!token) throw new ForbiddenException();
      const data = await this.formAttemptService.getAttemptById(
        token,
        validated.id as string
      );
      res.json({ data });
    } catch (error) {
      next(error);
    }
  };
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = CreateFormAttemptSchema.parse(req.body);
      const token = cookie.get(req, COOKIE_ENTITY.USER);
      if (!token) throw new ForbiddenException();
      const data = await this.formAttemptService.create(token, validated);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  };

  //TODO: Comment this function out for now
  // public bringItToLife = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     // const validated = CreateChatMessageSchema.parse(req.body);
  //     const validated = BaseModelSchema.parse(req.params);
  //     const token = getUserCookie(req);
  //     const message = await this.formAttemptService.bringItToLife(
  //       token,
  //       validated.id as string
  //     );
  //     res.json({ data: message });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}
