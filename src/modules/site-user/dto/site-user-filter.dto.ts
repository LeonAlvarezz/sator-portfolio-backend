import { BaseFilterSchema } from "@/core/types/base.type";
import z from "zod";

export const SiteUserFilterSchema = BaseFilterSchema.extend({
  username: z.string().optional(),
});

export type SiteUserFilter = z.infer<typeof SiteUserFilterSchema>;
