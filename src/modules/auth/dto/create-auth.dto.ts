import { z } from "zod";

export const CreateAuthSchema = z.object({
  email: z.email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type CreateAuth = z.infer<typeof CreateAuthSchema>;
