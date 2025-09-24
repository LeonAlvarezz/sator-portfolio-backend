import { db, type DrizzleTransaction } from "@/db";
import { roles } from "@/db/schema";
import type { CreateRole } from "@/types/role.type";
import { eq } from "drizzle-orm";
import { AdminRoleEnum } from "./entity/role.enum";

export class RoleRepository {
  public async findAll() {
    return await db.query.roles.findMany({
      with: {
        permission_flags: true,
      },
    });
  }

  public async findById(id: string, tx?: DrizzleTransaction) {
    const client = tx ? tx : db;
    return await client.query.roles.findFirst({
      where: eq(roles.id, id),
      with: {
        permission_flags: {
          with: {
            resource: true,
          },
        },
      },
    });
  }

  public async getAdminRole() {
    return db.query.roles.findFirst({
      where: eq(roles.name, AdminRoleEnum.ADMIN)
    })
  }

  public async create(payload: CreateRole, tx?: DrizzleTransaction) {
    const client = tx ? tx : db;
    return await client.insert(roles).values({
      name: payload.name,
    });
  }

  public async delete(id: string, tx?: DrizzleTransaction) {
    const client = tx ? tx : db;
    return client.delete(roles).where(eq(roles.id, id))
  }
}
