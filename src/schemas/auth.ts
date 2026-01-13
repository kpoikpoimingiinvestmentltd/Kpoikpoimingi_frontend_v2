import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const refreshTokenSchema = z.object({
	refreshToken: z.string().min(10),
});

export const loginResponseSchema = z.object({
	id: z.string(),
	accessToken: z.string(),
	refreshToken: z.string(),
	expiresIn: z.number().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
