import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../common";
import { users } from "./users.schema";
import { relations } from "drizzle-orm";
import { blogs } from "./blogs.schema";

export const siteUsers = pgTable('site_users', {
    id: uuid().defaultRandom().notNull().primaryKey(),
    profile_url: text(),
    website_name: text().notNull(),
    username: text().notNull(),
    link: text().notNull(),
    api_key: text().notNull().unique(),
    registered_at: timestamp(),
    user_id: uuid().references(() => users.id),
    ...timestamps,
})

export const siteUserRelation = relations(siteUsers, ({ many, one }) => ({
    blogs: many(blogs),
    sessions: many(blogs),
    user: one(users, {
        fields: [siteUsers.user_id],
        references: [users.id]
    })
}))