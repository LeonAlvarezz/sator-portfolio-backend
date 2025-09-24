import { boolean, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { roles, resources } from ".";

export const permissionFlags = pgTable(
    "permission_flags",
    {
        id: uuid().defaultRandom().notNull().primaryKey(),
        role_id: uuid()
            .notNull()
            .references(() => roles.id, { onDelete: "cascade" }),
        resource_id: uuid()
            .notNull()
            .references(() => resources.id),
        read: boolean("read").notNull().default(false),
        write: boolean("write").notNull().default(false),
        delete: boolean("delete").notNull().default(false),
    },
    (table) => [uniqueIndex("permission_flags_role_id_resource_id_unique").on(
        table.role_id,
        table.resource_id
    )]
);