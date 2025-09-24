import { z } from "zod";

export const CreateSessionSchema = z.object({
    two_factor_verified: z.boolean(),
    auth_id: z.string(),
    token: z.string(),
})

export type CreateSession = z.infer<typeof CreateSessionSchema>