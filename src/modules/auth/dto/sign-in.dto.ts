import { z } from "zod";
import { BaseAuthSchema } from "./base-auth.dto";

// Extend the base schema for Login
export const SigninSchema = BaseAuthSchema.extend({
  otp: z.number().lt(999999, { message: "Must be 6 characters long" }),
});

export type Signin = z.infer<typeof SigninSchema>;
