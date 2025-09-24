import { z } from "zod";

export const CreateSessionSchema = z.object({
    id: z.string(),
    two_factor_verified: z.boolean(),
    expires_at: z.date(),
    auth_id: z.string(),
})

export type CreateSession = z.infer<typeof CreateSessionSchema>