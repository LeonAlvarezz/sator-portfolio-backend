import { z } from "zod";
import { BaseAuthSchema } from "./base-auth.dto";


// Extend the base schema for SignUp
export const SignUpSchema = BaseAuthSchema.extend({
    username: z
        .string()
        .trim()
        .min(1, { message: "Username is required" })
        .max(20, {
            message: "Username must not exceed 20 characters",
        }),
});

export type Signup = z.infer<typeof SignUpSchema>;
