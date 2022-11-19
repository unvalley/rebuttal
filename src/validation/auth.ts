import * as z from "zod";

export const loginSchema = z.object({
  crowdId: z.string(),
  password: z.string().min(4).max(36),
});

export const signUpSchema = loginSchema;

export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;
