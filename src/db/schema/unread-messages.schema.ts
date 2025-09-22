import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../common";
import { chatMembers, chatRooms } from ".";
import { relations } from "drizzle-orm";

export const unreadMessages = pgTable('unread_messages', {
    id: uuid().defaultRandom().notNull().primaryKey(),
    total_count: integer(),
    chat_room_id: uuid().references(() => chatRooms.id),
    chat_member_id: uuid().references(() => chatMembers.id),
    ...timestamps,
})

export const unreadMessageRelation = relations(unreadMessages, ({ one }) => ({
    chat_member: one(chatMembers, {
        fields: [unreadMessages.chat_member_id],
        references: [chatMembers.id]
    }),
    chat_room: one(chatRooms, {
        fields: [unreadMessages.chat_room_id],
        references: [chatRooms.id]
    })
}))