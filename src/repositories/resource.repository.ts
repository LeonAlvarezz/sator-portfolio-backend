import { db, type DrizzleTransaction } from "@/db";
import { resources } from "@/db/schema";
import type { CreateResource } from "@/types/resource.type";
import { eq } from "drizzle-orm";

export class ResourceRepository {
  public async findAll() {
    return await db.query.resources.findMany();
  }
  public async create(payload: CreateResource) {
    return await db.insert(resources).values({
      name: payload.name,
    });
  }

  public async findByName(name: string, tx?: DrizzleTransaction) {
    const client = tx ? tx : db;
    return await client.query.resources.findFirst({
      where: eq(resources.name, name),
    });
  }
}
