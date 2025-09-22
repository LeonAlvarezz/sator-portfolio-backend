import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../common";
import { blogs } from ".";
import { relations } from "drizzle-orm";

export const blogMetric = pgTable('blog_metric', {
    id: uuid().defaultRandom().notNull().primaryKey(),
    blog_id: uuid().references(() => blogs.id).notNull(),
    view: integer().default(1),
    ...timestamps,
})


export const blogMetricRelation = relations(blogMetric, ({ one }) => ({
    blog: one(blogs, {
        fields: [blogMetric.blog_id],
        references: [blogs.id]
    })
}))