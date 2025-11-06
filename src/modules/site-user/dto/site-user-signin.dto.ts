import z from "zod";

export const SiteUserSigninSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  otp: z.number().lt(999999, { message: "Must be 6 characters long" }),
});

export type SiteUserSignin = z.infer<typeof SiteUserSigninSchema>;
