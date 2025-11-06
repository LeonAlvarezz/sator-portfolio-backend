import { ResourceService } from "@/services/resource.service";
import type { NextFunction, Response, Request } from "express";
export class ResourceController {
  private resourceService: ResourceService;
  constructor() {
    this.resourceService = new ResourceService();
  }
  public getResources = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resources = await this.resourceService.findAll();
      res.json({ data: resources });
    } catch (error) {
      next(error);
    }
  };
}
