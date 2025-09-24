import { SESSION_EXPIRES_DATE_MS } from "@/constant/base";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { SessionRepository } from "@/modules/session/session.repository";
import type { CreateSession } from "./dto/create-session.dto";
import type { SessionEntity } from "./entity/session.entity";

export class SessionService {
  private sessionRepository: SessionRepository;

  constructor() {
    this.sessionRepository = new SessionRepository();
  }

  public async createSession(
    payload: CreateSession & { token: string },
  ): Promise<SessionEntity> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(payload.token))
    );
    const session: CreateSession = {
      id: sessionId,
      auth_id: payload.auth_id,
      two_factor_verified: payload.two_factor_verified,
      expires_at: new Date(Date.now() + SESSION_EXPIRES_DATE_MS),
    };
    await this.sessionRepository.createSession(session);
    return session;
  }

  public async invalidateSession(id: string) {
    return await this.sessionRepository.deleteSessionById(id);
  }

  public async checkAndExtendSession(id: string, time: number) {
    if (Date.now() >= time) {
      await this.sessionRepository.deleteSessionById(id);
      return { session: null, auth: null };
    }
    if (Date.now() >= time - SESSION_EXPIRES_DATE_MS) {
      const extendedTime = new Date(Date.now() + SESSION_EXPIRES_DATE_MS);
      await this.sessionRepository.updateSessionExpiredAt(id, extendedTime);
    }
  }
}
