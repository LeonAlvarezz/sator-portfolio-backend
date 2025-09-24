import type { EncryptedUpdateTotp } from "../admin/admin.repository";
import { encryptToBuffer } from "@/utils/encryption";
import { db, type DrizzleTransaction } from "@/db";
import { eq } from "drizzle-orm";
import { auths } from "@/db/schema";
import type { Signup } from "./dto/sign-up.dto";

export class AuthRepository {
  public async checkByEmail(email: string) {
    return db.query.auths.findFirst({
      where: eq(auths.email, email),
      with: {
        admin: true,
        user: true,
        site_user: true,
      }
    });
  }

  public async createAuth(
    payload: Omit<Signup, "username">,
    tx: DrizzleTransaction
  ) {
    const client = tx ? tx : db;
    const [result] = await client.insert(auths).values({
      email: payload.email,
      password: payload.password,
    }).returning();
    return result;
  }

  public async updatePassword(
    id: string,
    password: string,
    tx?: DrizzleTransaction,
  ) {
    const client = tx ? tx : db;
    const [result] = await client.update(auths).set({
      password
    }).where(eq(auths.id, id)).returning();
    return result;
  }

  public async updateTotp(
    id: string,
    payload: EncryptedUpdateTotp,
    tx?: DrizzleTransaction
  ) {
    const encrypted = encryptToBuffer(payload.key);
    const client = tx ? tx : db;
    const [result] = await client.update(auths).set({
      totp_key: encrypted,
    }).where(eq(auths.id, id)).returning()
    return result;
  }
}
