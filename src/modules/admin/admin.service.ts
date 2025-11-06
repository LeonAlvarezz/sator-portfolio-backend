import { AdminRepository } from "@/modules/admin/admin.repository";
import { SessionRepository } from "@/modules/session/session.repository";
import type { UpdateTotp } from "@/types/auth.type";
import type { AssignAdminRole } from "@/types/admin.type";
import type { Signup } from "@/types/auth.type";
import { SessionService } from "../session/session.service";
import { db } from "@/db";
import { RoleRepository } from "@/modules/role/role.repository";
import type { Signin } from "../auth/dto/sign-in.dto";
import type { SessionResponse } from "../auth/dto/session-response.dto";
import { AuthService } from "../auth/auth.service";
import { InternalServerException } from "@/core/response/error/exception";
import { authUtil } from "../auth/auth.util";
import type { Auth } from "../auth/model/auth.model";

export class AdminService {
  private adminRepository: AdminRepository;
  private sessionRepository: SessionRepository;
  private authService: AuthService;
  private roleRepository: RoleRepository;
  private sessionService: SessionService;

  constructor() {
    this.adminRepository = new AdminRepository();
    this.sessionRepository = new SessionRepository();
    this.authService = new AuthService();
    this.roleRepository = new RoleRepository();
    this.sessionService = new SessionService();
  }

  public async getAdmins() {
    return this.adminRepository.findAll();
  }

  public async getAllAdminIds() {
    return this.adminRepository.findAllIds();
  }
  //Permission
  public async assignRole(payload: AssignAdminRole) {
    return this.adminRepository.assignRole(payload.admin_id, payload);
  }

  //Auth
  public async signUp(payload: Signup) {
    return db.transaction(async (tx) => {
      const auth = await this.authService.create(payload, tx);

      const adminRole = await this.roleRepository.getAdminRole();
      if (!adminRole)
        throw new InternalServerException({ message: "No admin role found" });
      const admin = await this.adminRepository.createAdmin(
        {
          username: payload.username,
          role_id: adminRole.id,
        },
        auth.id as string,
        tx
      );
      return admin;
    });
  }

  public async signin(payload: Signin): Promise<SessionResponse> {
    return await this.authService.signin(payload);
  }

  public async getMe(token: string): Promise<Auth> {
    return await this.authService.getMe(token);
  }

  public async signout(token: string) {
    const id = authUtil.decodeToSessionId(token);
    await this.sessionService.invalidateSession(id);
  }

  public async updateTotp(token: string, payload: UpdateTotp) {
    return this.authService.updateTotp(token, payload);
  }
}
