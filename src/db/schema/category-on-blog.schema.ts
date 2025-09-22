import { pgTable, uuid } from "drizzle-orm/pg-core";
import { auths, blogs, categories } from ".";
import { relations } from "drizzle-orm";

export const categoryOnBlogs = pgTable('category_on_blogs', {
    blog_id: uuid().references(() => blogs.id).notNull(),
    category_id: uuid().references(() => categories.id).notNull(),
    created_by: uuid().references(() => auths.id),
})

export const categoryOnBlogRelation = relations(categoryOnBlogs, ({ one }) => ({
    category: one(categories, { fields: [categoryOnBlogs.category_id], references: [categories.id] }),
    blog: one(blogs, { fields: [categoryOnBlogs.blog_id], references: [blogs.id] })
}))