import { useMutation } from "@tanstack/react-query";
import { apiPost } from "@/services/apiClient";
import type { LoginInput, LoginResponse, RefreshTokenInput } from "@/schemas/auth";
import { loginResponseSchema } from "@/schemas/auth";
import { saveAuthToStorage } from "@/services/authPersistence";
import { API_ROUTES } from "./routes";

export function useLogin(onSuccess?: (data: LoginResponse) => void) {
	return useMutation<LoginResponse, Error, LoginInput>({
		mutationFn: async (payload: LoginInput) => {
			const data = await apiPost<LoginResponse>(API_ROUTES.auth.login, payload, { skipAuth: true });
			const parsed = loginResponseSchema.parse(data);
			saveAuthToStorage({ id: parsed.id, accessToken: parsed.accessToken, refreshToken: parsed.refreshToken });
			return parsed;
		},
		onSuccess,
	});
}

export function useRefreshToken(onSuccess?: (data: LoginResponse) => void) {
	return useMutation<LoginResponse, Error, RefreshTokenInput>({
		mutationFn: async (payload: RefreshTokenInput) => {
			const data = await apiPost<LoginResponse>(API_ROUTES.auth.refreshToken, payload);
			const parsed = loginResponseSchema.parse(data);
			saveAuthToStorage({ id: parsed.id, accessToken: parsed.accessToken, refreshToken: parsed.refreshToken });
			return parsed;
		},
		onSuccess,
	});
}
