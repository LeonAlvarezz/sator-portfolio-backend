import { BaseFilterSchema } from "@/core/types/base.type";
import z from "zod";

export const UserFilterSchema = BaseFilterSchema.extend({
  username: z.string().optional(),
});

export type UserFilter = z.infer<typeof UserFilterSchema>;
