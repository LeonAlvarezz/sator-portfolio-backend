import { UserRepository } from "@/repositories/user.repository";
import { type UserFilter } from "@/types/user.type";
import config from "@/config/environment";
import { getPaginationMetadata } from "@/utils/pagination";
import type { Login, Signup } from "@/types/auth.type";
import { ThrowInternalServer, ThrowUnauthorized } from "@/utils/exception";
import { verifyTOTP } from "@oslojs/otp";
import { decrypt, encryptSessionToken } from "@/utils/encryption";
import { CacheService } from "./cache.service";
import Logger from "@/logger/logger";
import {
  decodeToSessionId,
  generateSessionToken,
  hashPassword,
  verifyPassword,
} from "@/utils/auth_util";
import { AuthRepository } from "@/repositories/auth.repository";
import { SessionService } from "./session.service";
import prisma from "@/loaders/prisma";
import { SessionRepository } from "@/repositories/session.repository";
import { IdentityRole } from "@/types/base.type";
import { generateRandomUsername } from "@/utils/string";
import { SESSION_EXPIRES_DATE_MS } from "@/constant/base";

export class UserService {
  private userRepository: UserRepository;
  private authRepository: AuthRepository;
  private sessionRepository: SessionRepository;
  private sessionService: SessionService;
  private cacheService: CacheService;

  constructor() {
    this.userRepository = new UserRepository();
    this.authRepository = new AuthRepository();
    this.sessionRepository = new SessionRepository();
    this.sessionService = new SessionService();
    this.cacheService = new CacheService();
  }

  public async getUsers() {
    return await this.userRepository.findAll();
  }

  public async paginateUsers(filter: UserFilter) {
    const count = await this.userRepository.count(filter);
    const { current_page, page_size, page } = getPaginationMetadata(
      filter,
      count
    );
    const users = await this.userRepository.paginate(filter);
    return { data: users, metadata: { count, current_page, page_size, page } };
  }

  public async signup(token: string, payload: Signup) {
    const passwordHash = await hashPassword(payload.password);
    const sessionId = decodeToSessionId(token);
    const result = await this.sessionRepository.findSessionById(sessionId);
    if (result) {
      const { user } = result;
      if (!user) return ThrowInternalServer();
      const auth = await this.authRepository.findById(user.auth_id);
      if (auth && auth.is_anonymous) {
        await this.signout(token);
        //Bind Account
        return prisma.$transaction(async (tx) => {
          const bindedAuth = await this.authRepository.bindAuth(
            auth.id,
            {
              email: payload.email,
              password: passwordHash,
            },
            tx
          );
          if (!bindedAuth.user) return ThrowInternalServer();
          return this.userRepository.bindUser(
            bindedAuth.user?.id,
            {
              username: payload.username,
            },
            tx
          );
        });
      }
    }

    return prisma.$transaction(async (tx) => {
      const auth = await this.authRepository.createAuth(
        {
          email: payload.email,
          password: passwordHash,
        },
        tx
      );
      return this.userRepository.addUser(
        {
          username: payload.username,
        },
        auth.id,
        tx
      );
    });
  }

  public async login(payload: Login) {
    const auth = await this.authRepository.checkByEmail(payload.email);
    if (!auth) {
      return ThrowUnauthorized("Invalid Credentials");
    }

    const isPasswordValid = await verifyPassword(
      payload.password,
      auth.password
    );
    if (!isPasswordValid) {
      return ThrowUnauthorized("Invalid Credentials");
    }

    if (auth.totp_key) {
      const key = decrypt(Uint8Array.from(auth.totp_key));
      if (!verifyTOTP(key, 30, 6, String(payload.otp))) {
        return ThrowInternalServer("Invalid Code");
      }
    } else {
      if (payload.otp !== Number(config.defaultOTPCode)) {
        return ThrowUnauthorized("Invalid Code");
      }
    }

    const sessionToken = generateSessionToken();

    try {
      this.cacheService.saveAuth(sessionToken, auth);
    } catch (error) {
      Logger.error(error);
    }
    if (!auth.user) return ThrowUnauthorized("User cannot be found");
    const session = await this.sessionService.createSession(
      {
        token: sessionToken,
        two_factor_verified: !!auth.totp_key,
      },
      { id: auth.user.id, role: IdentityRole.USER }
    );

    return {
      ...auth.user,
      token: sessionToken,
      expires_at: session.expires_at,
    };
  }

  public async anonymousLogin() {
    const username = generateRandomUsername();
    const passwordHash = await hashPassword(config.defaultPassword);
    return prisma.$transaction(async (tx) => {
      const auth = await this.authRepository.createAuth(
        { email: `${username}@gmail.com`, password: passwordHash },
        tx,
        IdentityRole.ANONYMOUS
      );
      const user = await this.userRepository.addUser(
        { username },
        auth.id,
        tx,
        IdentityRole.ANONYMOUS
      );
      const sessionToken = generateSessionToken();
      const session = await this.sessionRepository.createSession(
        {
          id: encryptSessionToken(sessionToken),
          user_id: user.id,
          admin_id: null,
          site_user_id: null,
          two_factor_verified: false,
          expires_at: new Date(Date.now() + SESSION_EXPIRES_DATE_MS),
        },
        tx
      );
      return {
        ...user,
        token: sessionToken,
        expires_at: session.expires_at,
      };
    });
  }

  public async signout(token: string) {
    const id = decodeToSessionId(token);
    const result = await this.sessionService.invalidateSession(id);
    return result;
  }

  public async getMe(token: string) {
    const sessionId = decodeToSessionId(token);
    const result = await this.sessionRepository.findSessionById(sessionId);
    if (result === null) {
      return ThrowUnauthorized();
    }
    const { user, ...session } = result;
    if (user === null) {
      return ThrowUnauthorized();
    }

    const time = session.expires_at.getTime();
    await this.sessionService.checkAndExtendSession(sessionId, time);
    return user;
  }
}
