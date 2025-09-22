import { boolean, pgTable, uuid } from "drizzle-orm/pg-core";
import { numRange, timestamps } from "../common";
import { formResponses, users } from ".";
import { relations } from "drizzle-orm";
export const formAttempts = pgTable('form_attempts', {
    id: uuid().defaultRandom().notNull().primaryKey(),
    quoted_price: numRange(),
    is_requested: boolean().default(false),
    user_id: uuid().references(() => users.id),
    ...timestamps,
})

export const formAttemptRelations = relations(formAttempts, ({ one, many }) => ({
    user: one(users, {
        fields: [formAttempts.user_id],
        references: [users.id]
    }),
    form_responses: many(formResponses)
}))