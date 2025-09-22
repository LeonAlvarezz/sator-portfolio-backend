import { pgTable, uuid } from "drizzle-orm/pg-core";
import { auths, portfolios, categories } from ".";
import { relations } from "drizzle-orm";

export const categoryOnPortfolios = pgTable('category_on_portfolios', {
    portfolio_id: uuid().references(() => portfolios.id).notNull(),
    category_id: uuid().references(() => categories.id).notNull(),
    created_by: uuid().references(() => auths.id),
})

export const categoryOnPortfolioRelation = relations(categoryOnPortfolios, ({ one }) => ({
    category: one(categories, { fields: [categoryOnPortfolios.category_id], references: [categories.id] }),
    portfolio: one(portfolios, { fields: [categoryOnPortfolios.portfolio_id], references: [portfolios.id] })
}))