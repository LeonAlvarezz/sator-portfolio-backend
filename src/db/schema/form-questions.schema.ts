import { integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { enumToPgEnum, timestamps } from "../common";
import { FormQuestionTypeEnum } from "@/modules/form-question/entity/form-question.enum";
import { formOptions, formResponses } from ".";
import { relations } from "drizzle-orm";
export const formQuestionTypeEnum = pgEnum('FormQuestionTypeEnum', enumToPgEnum(FormQuestionTypeEnum))
export const formQuestions = pgTable('form_questions', {
    id: uuid().defaultRandom().notNull().primaryKey(),
    published_at: timestamp(),
    form_text: text().notNull(),
    type: formQuestionTypeEnum().default(FormQuestionTypeEnum.SINGLE_CHOICE).notNull(),
    order: integer().notNull().unique(),
    ...timestamps,
})

export const formQuestionRelation = relations(formQuestions, ({ many }) => ({
    form_options: many(formOptions),
    form_responses: many(formResponses),
}))