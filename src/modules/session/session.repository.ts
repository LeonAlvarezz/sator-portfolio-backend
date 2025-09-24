import { db, type DrizzleTransaction } from "@/db";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { CreateSession } from "./dto/create-session.dto";

export class SessionRepository {
  public async findSessionById(id: string) {
    return await db.query.sessions.findFirst({
      where: eq(sessions.id, id),
      with: {
        auth: {
          with: {
            user: true,
            site_user: true,
          }
        }
      },
    });
  }

  public async deleteSessionById(sessionId: string) {
    return await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  public async updateSessionExpiredAt(sessionId: string, expiredAt: Date) {
    return await db.update(sessions).set({
      expires_at: expiredAt,
    }).where(eq(sessions.id, sessionId));
  }

  public async createSession(payload: CreateSession) {
    return await db.insert(sessions).values(payload);
  }

  public async updateTwoFactorVerified(
    sessionId: string,
    tx?: DrizzleTransaction
  ) {
    const client = tx ?? db;
    return await client.update(sessions).set({
      two_factor_verified: true,
    }).where(eq(sessions.id, sessionId));
  }
}
