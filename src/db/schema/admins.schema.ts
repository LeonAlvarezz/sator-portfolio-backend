import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { bytea, timestamps } from "../common";
import { relations } from "drizzle-orm";
import { auths } from "./auths.schema";
import { roles } from "./roles.schema";
import { blogs } from "./blogs.schema";
export const admins = pgTable("admins", {
  id: uuid().defaultRandom().notNull().primaryKey(),
  username: varchar({ length: 255 }).notNull().unique(),
  profile_url: text(),
  role_id: uuid()
    .references(() => roles.id)
    .notNull(),
  auth_id: uuid()
    .references(() => auths.id, { onDelete: "cascade" })
    .notNull(),
  totp_key: bytea(),
  last_login: timestamp(),
  ...timestamps,
});

export const adminRelation = relations(admins, ({ one, many }) => ({
  auth: one(auths, {
    fields: [admins.auth_id],
    references: [auths.id],
  }),
  role: one(roles, {
    fields: [admins.role_id],
    references: [roles.id],
  }),
  blogs: many(blogs),
}));
