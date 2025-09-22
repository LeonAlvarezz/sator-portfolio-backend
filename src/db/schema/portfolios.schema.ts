import { json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../common";
import { relations } from "drizzle-orm";
import { admins, siteUsers } from ".";
import { categoryOnPortfolios } from "./category-on-portfolio.schema";

export const portfolios = pgTable('portfolios', {
    id: uuid().defaultRandom().notNull().primaryKey(),
    title: text().notNull(),
    description: text().notNull(),
    slug: text().unique().notNull(),
    gallery: text().array(),
    content: json(),
    cover_url: text(),
    github_link: text(),
    preview_link: text(),
    site_user_id: uuid().references(() => siteUsers.id),
    admin_id: uuid().references(() => admins.id),
    published_at: timestamp(),
    ...timestamps,
})

export const portfolioRelation = relations(portfolios, ({ one, many }) => ({
    category_on_portfolios: many(categoryOnPortfolios),
    admin: one(admins, {
        fields: [portfolios.admin_id],
        references: [admins.id]
    }),
    site_user: one(siteUsers, {
        fields: [portfolios.site_user_id],
        references: [siteUsers.id]
    })
}))