import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../common";
import { users } from "./users.schema";
import { relations } from "drizzle-orm";
import { blogs } from "./blogs.schema";
import { auths } from "./auths.schema";

export const siteUsers = pgTable('site_users', {
    id: uuid().defaultRandom().notNull().primaryKey(),
    profile_url: text(),
    website_name: text().notNull(),
    username: text().notNull(),
    link: text().notNull(),
    api_key: text().notNull().unique(),
    registered_at: timestamp(),
    auth_id: uuid().references(() => auths.id, { onDelete: "cascade" }),
    user_id: uuid().references(() => users.id),
    ...timestamps,
})

export const siteUserRelation = relations(siteUsers, ({ many, one }) => ({
    blogs: many(blogs),
    sessions: many(blogs),
    auth: one(auths, {
        fields: [siteUsers.auth_id],
        references: [auths.id]
    }),
    user: one(users, {
        fields: [siteUsers.user_id],
        references: [users.id]
    })
}))