import { CategoryRepository } from "@/repositories/category.repository";
import type { CreateCategory } from "@/types/category.type";
import type { Request } from "express";
import { SiteUserService } from "../modules/site-user/site-user.service";
import { AdminService } from "../modules/admin/admin.service";
import { env } from "@/libs";
import { UnauthorizedException } from "@/core/response/error/exception";
import { cookie, COOKIE_ENTITY } from "@/libs/cookie";

export class CategoryService {
  private categoryRepository: CategoryRepository;
  private siteUserService: SiteUserService;
  private adminService: AdminService;
  constructor() {
    this.categoryRepository = new CategoryRepository();
    this.siteUserService = new SiteUserService();
    this.adminService = new AdminService();
  }
  public async findAll() {
    return this.categoryRepository.findAll();
  }
  public async findBySiteUser(req: Request) {
    const sessionToken = cookie.get(req, COOKIE_ENTITY.SITE_USER);
    const siteUser = await this.siteUserService.getMe(sessionToken);
    if (!siteUser) throw new UnauthorizedException();
    return this.categoryRepository.findBySiteUser(siteUser.id as string);
  }
  public async create(req: Request, payload: CreateCategory) {
    const isAdmin = req.originalUrl.startsWith(`${env.API_PREFIX}/admin`);
    const sessionToken = isAdmin
      ? cookie.get(req, COOKIE_ENTITY.ADMIN)
      : cookie.get(req, COOKIE_ENTITY.SITE_USER);
    const auth = isAdmin
      ? await this.adminService.getMe(sessionToken)
      : await this.siteUserService.getMe(sessionToken);
    if (!auth) throw new UnauthorizedException();
    return this.categoryRepository.create(auth.id as string, isAdmin, payload);
  }

  public async update(id: string, payload: CreateCategory) {
    return this.categoryRepository.update(id, payload);
  }
  public async delete(id: string) {
    //TODO: May Involve Checking and Only Allow Admin Whose Created the Category to Delete or Super Admin
    return this.categoryRepository.delete(id);
  }
}
