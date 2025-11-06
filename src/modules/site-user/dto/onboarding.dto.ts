import z from "zod";

export const OnboardingSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type Onboarding = z.infer<typeof OnboardingSchema>;
