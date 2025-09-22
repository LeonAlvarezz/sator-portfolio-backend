import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../common";
import { siteUsers } from ".";
import { relations } from "drizzle-orm";

export const siteMetric = pgTable('site_metric', {
    id: uuid().defaultRandom().notNull().primaryKey(),
    site_user_id: uuid().references(() => siteUsers.id).notNull(),
    view: integer().default(1),
    ...timestamps,
})


export const siteMetricRelation = relations(siteMetric, ({ one }) => ({
    siteUser: one(siteUsers, {
        fields: [siteMetric.site_user_id],
        references: [siteUsers.id]
    })
}))