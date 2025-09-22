import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { permissionFlags } from ".";

export const resources = pgTable('resources', {
    id: serial("id").primaryKey(),
    name: text().unique().notNull(),
    ...timestamp
})

export const resourceRelation = relations(resources, ({ many }) => ({
    permission_flags: many(permissionFlags)
}))   