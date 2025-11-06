import type { Login, Signup } from "@/types/auth.type";
import { authUtil } from "./auth.util";
import { db, type DrizzleTransaction } from "@/db";
import { AuthRepository } from "./auth.repository";
import type { Auth } from "./model/auth.model";
import { decrypt } from "@/utils";
import { verifyTOTP } from "@oslojs/otp";
import { env } from "@/libs";
import { SessionService } from "../session/session.service";
import type { SessionResponse } from "./dto/session-response.dto";
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "@/core/response/error/exception";

export class AuthService {
  private readonly authRepository: AuthRepository;
  private readonly sessionService: SessionService;
  constructor() {
    this.authRepository = new AuthRepository();
    this.sessionService = new SessionService();
  }
  public async create(payload: Signup, tx?: DrizzleTransaction): Promise<Auth> {
    const passwordHash = await authUtil.hashPassword(payload.password);
    return this.authRepository.create(
      {
        email: payload.email,
        password: passwordHash,
      },
      tx
    );
  }

  public async signin(payload: Login): Promise<SessionResponse> {
    const auth = await this.authRepository.checkByEmail(payload.email);
    if (!auth) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await authUtil.verifyPassword(
      payload.password,
      auth.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    if (auth.totp_key) {
      const key = decrypt(Uint8Array.from(auth.totp_key));
      if (verifyTOTP(key, 30, 6, String(payload.otp))) {
        throw new UnauthorizedException({ message: "Invalid Code" });
      }
    } else {
      if (payload.otp !== Number(env.DEFAULT_OTP_CODE)) {
        throw new UnauthorizedException({ message: "Invalid Code" });
      }
    }

    const sessionToken = authUtil.generateSessionToken();

    // try {
    //   this._cacheService.saveAuth(sessionToken, auth);
    // } catch (error) {
    //   logger.error(error);
    // }
    if (!auth.user) throw new NotFoundException({ message: "User not found" });

    const session = await this.sessionService.createSession({
      token: sessionToken,
      two_factor_verified: !!auth.totp_key,
      auth_id: auth.id,
    });

    return {
      token: sessionToken,
      expires_at: session.expires_at,
    };
  }

  public async signout(token: string) {
    const id = authUtil.decodeToSessionId(token);
    await this.sessionService.invalidateSession(id);
    return;
  }

  public async getMe(token: string): Promise<Auth> {
    const sessionId = authUtil.decodeToSessionId(token);
    const result = await this.sessionService.findById(sessionId);
    if (!result) throw new ForbiddenException();
    if (!result.auth.admin) throw new UnauthorizedException();
    const time = result.expires_at.getTime();
    await this.sessionService.checkAndExtendSession(sessionId, time);
    return result.auth;
  }

  public async findByEmail(email: string): Promise<Auth | undefined> {
    return await this.authRepository.checkByEmail(email);
  }
}
