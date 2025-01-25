import { z } from "zod";

export const loginSchema = z.object({
	email: z.string(),
	password: z.string(),
});

export const signupSchema = z.object({
	email: z.string(),
	password: z.string(),
	name: z.string(),
});
