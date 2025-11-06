import { json, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { enumToPgEnum, timestamps } from "../common";
import { ChatMessageTypeEnum } from "@/modules/chat-messages/model/chat-message.enum";
import { chatRooms, chatMembers } from ".";
import { relations } from "drizzle-orm";
export const chatMessageTypeEnum = pgEnum("ChatMessageType", enumToPgEnum(ChatMessageTypeEnum));
export const chatMessages = pgTable('chat_messages', {
    id: uuid().defaultRandom().notNull().primaryKey(),
    content: text().notNull(),
    message_type: chatMessageTypeEnum().default(ChatMessageTypeEnum.TEXT).notNull(),
    media: text().array(),
    metadata: json(),
    chat_member_id: uuid().references(() => chatMembers.id, { onDelete: "cascade" }).notNull(),
    chat_room_id: uuid().references(() => chatRooms.id, { onDelete: "cascade" }).notNull(),
    ...timestamps,
})
export const chatMessageRelation = relations(chatMessages, ({ one }) => ({
    chat_member: one(chatMembers, {
        fields: [chatMessages.chat_member_id],
        references: [chatMembers.id]
    }),
    chat_room: one(chatRooms, {
        fields: [chatMessages.chat_room_id],
        references: [chatRooms.id]
    }),
}))