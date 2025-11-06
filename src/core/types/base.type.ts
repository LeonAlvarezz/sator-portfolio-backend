import { z } from "zod";

export type Identity = {
  id: string;
  role?: IdentityRole;
};

export enum IdentityRole {
  ADMIN = "admin",
  USER = "user",
  SITE_USER = "site_user ",
}

export enum COOKIE {
  ADMIN = "admin_token",
  USER = "user_token",
  SITE_USER = "site_user_token",
}

export const BaseModelSchema = z.object({
  id: z.union([
    z.string().trim().min(1, { message: "ID Not Found" }),
    z.number(),
  ]),
  created_at: z.date(),
  updated_at: z.date().optional().nullable(),
  deleted_at: z.date().optional().nullable(),
});

export const ValidatedSlugSchema = z.object({
  slug: z
    .string()
    .trim()
    .refine((s) => !s.includes(" "), "No Spaces!"),
});

export const BaseFilterSchema = z.object({
  page: z.string().min(1).optional(),
  limit: z.string().min(1).optional(),
});

export type BaseFilter = z.infer<typeof BaseFilterSchema>;
export type BaseModel = z.infer<typeof BaseModelSchema>;
