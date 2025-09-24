import { db, type DrizzleTransaction } from "@/db";
import { admins } from "@/db/schema";
import type { AssignAdminRole, CreateAdmin } from "@/types/admin.type";
import type { UpdateTotp } from "@/types/auth.type";
import { eq } from "drizzle-orm";

export interface EncryptedUpdateTotp extends Omit<UpdateTotp, "key"> {
  key: Uint8Array;
}

export class AdminRepository {
  public async findAll() {
    return await db.query.admins.findMany({
      with: {
        role: true
      },
    });
  }
  public async findAllIds() {
    return await db.query.admins.findMany({
      columns: {
        id: true,
      }
    });
  }
  public async findById(id: string) {
    return db.query.admins.findFirst({
      where: eq(admins.id, id),
    });
  }
  public async createAdmin(payload: CreateAdmin, auth_id: string, tx?: DrizzleTransaction) {
    // return db.query.admins.create({
    //   data: {
    //     username: payload.username,
    //     role_id: 1, //ADMIN By Defautl
    //     auth_id,
    //   },
    // });
    const client = tx ? tx : db;
    const [result] = await client.insert(admins).values({
      username: payload.username,
      role_id: payload.role_id,
      auth_id
    }
    ).returning();
    return result;
  }

  public async assignRole(id: string, payload: AssignAdminRole) {
    const [result] = await db.update(admins).set({
      role_id: payload.role_id,
    }).where(eq(admins.id, id)).returning();
    return result;
  }
}
