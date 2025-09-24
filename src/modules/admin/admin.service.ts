import { AdminRepository } from "@/modules/admin/admin.repository";
import { SessionRepository } from "@/modules/session/session.repository";
import {
  ThrowInternalServer,
  ThrowNotFound,
  ThrowUnauthorized,
} from "@/utils/exception";
import { decodeBase64 } from "@oslojs/encoding";
import { verifyTOTP } from "@oslojs/otp";
import { env } from "@/config";

import { COOKIE, IdentityRole } from "@/types/base.type";
import type { UpdateTotp } from "@/types/auth.type";
import prisma from "@/loaders/prisma";
import Logger from "@/logger/logger";
import { decrypt } from "@/utils/encryption";
import type { AssignAdminRole } from "@/types/admin.type";
import type { Login, Signup } from "@/types/auth.type";
import { AuthRepository } from "@/repositories/auth.repository";
import {
  decodeToSessionId,
  generateSessionToken,
  hashPassword,
  verifyPassword,
} from "@/utils/auth_util";
import { SessionService } from "../session/session.service";
import { setCookie } from "@/utils/cookie";
import type { Response } from "express";
import { db } from "@/db";
import { RoleRepository } from "@/modules/role/role.repository";
import { ForbiddenException, InternalServerException, NotFoundException, UnauthorizedException } from "@/libs";

export class AdminService {
  private adminRepository: AdminRepository;
  private sessionRepository: SessionRepository;
  private authRepository: AuthRepository;
  private roleRepository: RoleRepository;
  private sessionService: SessionService;

  constructor() {
    this.adminRepository = new AdminRepository();
    this.sessionRepository = new SessionRepository();
    this.authRepository = new AuthRepository();
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
    const existingAdmin = await this.authRepository.checkByEmail(payload.email);
    if (existingAdmin) return ThrowInternalServer("Admin Already Registered");

    return db.transaction(async (tx) => {
      const hashedPassword = await hashPassword(payload.password);


      const auth = await this.authRepository.createAuth(
        {
          email: payload.email,
          password: hashedPassword,
        },
        tx
      );

      const adminRole = await this.roleRepository.getAdminRole();
      if (!adminRole) throw new InternalServerException({ message: 'No admin role found' });
      const admin = await this.adminRepository.createAdmin(
        {
          username: payload.username,
          role_id: adminRole.id
        },
        auth.id,
        tx,
      );
      return admin;
    });
  }

  public async login(res: Response, payload: Login) {
    const auth = await this.authRepository.checkByEmail(payload.email);
    if (!auth || !auth.admin) throw new NotFoundException({ message: "Admin not found" });
    const isPasswordValid = await verifyPassword(
      payload.password,
      auth.password
    );
    if (!isPasswordValid) throw new UnauthorizedException({ message: "Invalid User Credentials" })

    if (auth.totp_key) {
      const key = decrypt(Uint8Array.from(auth.totp_key));
      if (!verifyTOTP(key, 30, 6, String(payload.otp))) throw new UnauthorizedException({ message: "Invalid Code" });
    } else {
      if (payload.otp !== Number(env.DEFAULT_OTP_CODE)) throw new UnauthorizedException({ message: "Invalid Code" });
    }
    const sessionToken = generateSessionToken();
    const session = await this.sessionService.createSession(
      {
        token: sessionToken,
        two_factor_verified: !!auth.totp_key,
      },
      { id: auth.admin.id, role: IdentityRole.ADMIN }
    );
    setCookie(res, COOKIE.ADMIN, sessionToken);
    return {
      ...auth.admin,
      token: sessionToken,
      expires_at: session.expires_at,
    };
  }

  public async getMe(token: string) {
    const sessionId = decodeToSessionId(token);
    const result = await this.sessionRepository.findSessionById(sessionId);
    if (result === null) throw new ForbiddenException();
    const { admin, ...session } = result;
    if (admin === null) throw new UnauthorizedException();
    const time = session.expires_at.getTime();
    await this.sessionService.checkAndExtendSession(sessionId, time);
    return admin;
  }

  public async signout(token: string) {
    const id = decodeToSessionId(token);
    const result = await this.sessionService.invalidateSession(id);
    return result;
  }

  public async UpdateTotp(token: string, payload: UpdateTotp) {
    try {
      let key: Uint8Array;
      const sessionId = decodeToSessionId(token);
      const admin = await this.getMe(token);

      try {
        key = decodeBase64(payload.key);
      } catch {
        throw new InternalServerException({ message: "Invalid Key, Failed To Decode" });
      }

      if (key.byteLength !== 20) throw new InternalServerException({ message: "Invalid Key, ByteLength Invalid" });
      if (!verifyTOTP(key, 30, 6, payload.code)) throw new UnauthorizedException({ message: "Invalid Code" })

      const result = await db.transaction(async (tx) => {
        await this.sessionRepository.updateTwoFactorVerified(sessionId, tx);
        // return await this.authRepository.updateTotp(
        //   admin.auth_id,
        //   {
        //     code: payload.code,
        //     key: key,
        //   },
        //   tx
        // );
      });

      return result;
    } catch (error) {
      Logger.error(error);
      return ThrowInternalServer(
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}
