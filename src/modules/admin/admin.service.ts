import { AdminRepository } from "@/modules/admin/admin.repository";
import { SessionRepository } from "@/modules/session/session.repository";
import { decodeBase64 } from "@oslojs/encoding";
import { verifyTOTP } from "@oslojs/otp";
import { env } from "@/libs";

import { COOKIE } from "@/types/base.type";
import type { UpdateTotp } from "@/types/auth.type";
import { decrypt } from "@/utils/encryption";
import type { AssignAdminRole } from "@/types/admin.type";
import type { Login, Signup } from "@/types/auth.type";
import { AuthRepository } from "@/modules/auth/auth.repository";
import { authUtil } from "@/utils/auth_util";
import { SessionService } from "../session/session.service";
import { setCookie } from "@/utils/cookie";
import type { Response } from "express";
import { db } from "@/db";
import { RoleRepository } from "@/modules/role/role.repository";
import {
  ForbiddenException,
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
} from "@/libs";
import type { Signin } from "../auth/dto/sign-in.dto";
import type { SessionResponse } from "../auth/dto/session-response.dto";
import { AuthService } from "../auth/auth.service";

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
    const existingAdmin = await this.authService.findByEmail(payload.email);
    if (existingAdmin)
      throw new Conflic({
        message: "Admin Already Registered",
      });

    return db.transaction(async (tx) => {
      const hashedPassword = await authUtil.hashPassword(payload.password);

      const auth = await this.authRepository.createAuth(
        {
          email: payload.email,
          password: hashedPassword,
        },
        tx
      );

      const adminRole = await this.roleRepository.getAdminRole();
      if (!adminRole)
        throw new InternalServerException({ message: "No admin role found" });
      const admin = await this.adminRepository.createAdmin(
        {
          username: payload.username,
          role_id: adminRole.id,
        },
        auth.id,
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
    const result = await this.sessionService.invalidateSession(id);
    return result;
  }

  public async UpdateTotp(token: string, payload: UpdateTotp) {
    try {
      let key: Uint8Array;
      const sessionId = authUtil.decodeToSessionId(token);
      const admin = await this.getMe(token);

      if (!admin) throw new ForbiddenException();

      try {
        key = decodeBase64(payload.key);
      } catch {
        throw new InternalServerException({
          message: "Invalid Key, Failed To Decode",
        });
      }

      if (key.byteLength !== 20)
        throw new InternalServerException({
          message: "Invalid Key, ByteLength Invalid",
        });
      if (!verifyTOTP(key, 30, 6, payload.code))
        throw new UnauthorizedException({ message: "Invalid Code" });

      const result = await db.transaction(async (tx) => {
        await this.sessionRepository.updateTwoFactorVerified(sessionId, tx);
        return await this.authRepository.updateTotp(
          admin.auth_id,
          {
            code: payload.code,
            key: key,
          },
          tx
        );
      });

      return result;
    } catch (error) {
      throw new InternalServerException({
        error,
      });
    }
  }
}
