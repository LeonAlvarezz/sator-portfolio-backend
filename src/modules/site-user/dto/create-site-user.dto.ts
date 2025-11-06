import z from "zod";

export const CreateSiteUserSchema = z.object({
  website_name: z.string().trim().min(1),
  link: z.string().min(1).trim(),
  user_id: z.string().min(1).trim(),
  username: z.string().optional(),
});
export type CreateSiteUser = z.infer<typeof CreateSiteUserSchema>;
