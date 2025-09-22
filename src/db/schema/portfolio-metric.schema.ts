import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../common";
import { portfolios } from ".";
import { relations } from "drizzle-orm";

export const portfolioMetric = pgTable('portfolio_metric', {
    id: uuid().defaultRandom().notNull().primaryKey(),
    portfolio_id: uuid().references(() => portfolios.id).notNull(),
    view: integer().default(1),
    ...timestamps,
})


export const portfolioMetricRelation = relations(portfolioMetric, ({ one }) => ({
    portfolio: one(portfolios, {
        fields: [portfolioMetric.portfolio_id],
        references: [portfolios.id]
    })
}))