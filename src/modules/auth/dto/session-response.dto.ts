import { z } from "zod";

export const SessionResponseSchema = z.object({
  token: z.string().min(1),
  expires_at: z.date(),
});

export type SessionResponse = z.infer<typeof SessionResponseSchema>;
