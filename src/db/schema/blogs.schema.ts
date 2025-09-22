import { json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../common";
import { relations } from "drizzle-orm";
import { admins, categoryOnBlogs, siteUsers } from ".";

export const blogs = pgTable('blogs', {
    id: uuid().defaultRandom().notNull().primaryKey(),
    published_at: timestamp(),
    slug: text().unique().notNull(),
    content: json(),
    cover_url: text(),
    description: text().notNull(),
    site_user_id: uuid().references(() => siteUsers.id),
    admin_id: uuid().references(() => admins.id),
    ...timestamps,
})

export const blogRelation = relations(blogs, ({ one, many }) => ({
    admin: one(admins, {
        fields: [blogs.admin_id],
        references: [admins.id]
    }),
    site_user: one(siteUsers, {
        fields: [blogs.site_user_id],
        references: [siteUsers.id]
    }),
    category_on_blogs: many(categoryOnBlogs)
}))