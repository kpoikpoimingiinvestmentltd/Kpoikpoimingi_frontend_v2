import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
	expiresInToExpiresAt,
	isTokenExpiringSoon,
	loadAuthFromStorage,
	saveAuthToStorage,
} from "@/services/authPersistence";
import { apiPost } from "@/services/apiClient";
import { API_ROUTES } from "@/api/routes";
import { clearAuth, setAuth } from "@/store/authSlice";

const MAX_TIMEOUT_MS = 2_147_483_647; // setTimeout 32-bit limit

export function AuthInitializer() {
	const dispatch = useDispatch();
	const authToken = useSelector((state: RootState) => state.auth.accessToken);
	const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);
	const initializeRef = useRef(false);

	useEffect(() => {
		if (initializeRef.current) return;
		initializeRef.current = true;

		const initializeAuth = async () => {
			const storedAuth = loadAuthFromStorage();

			if (!storedAuth || !storedAuth.accessToken) {
				return;
			}

			if (storedAuth.expiresAt && isTokenExpiringSoon(storedAuth.expiresAt)) {
				if (storedAuth.refreshToken) {
					try {
						const response = await apiPost<{
							id: string;
							accessToken: string;
							refreshToken: string;
							expiresIn?: number;
						}>(
							API_ROUTES.auth.refreshToken,
							{ refreshToken: storedAuth.refreshToken },
							{ skipAuth: true },
						);

						saveAuthToStorage({
							id: response.id,
							accessToken: response.accessToken,
							refreshToken: response.refreshToken,
							expiresAt: expiresInToExpiresAt(response.expiresIn),
						});

						dispatch(
							setAuth({
								id: response.id,
								accessToken: response.accessToken,
								refreshToken: response.refreshToken,
							}),
						);
					} catch {
						saveAuthToStorage(null);
						dispatch(clearAuth());
					}
				} else {
					saveAuthToStorage(null);
					dispatch(clearAuth());
				}
			}
		};

		initializeAuth();
	}, [dispatch]);

	useEffect(() => {
		if (!refreshToken || !authToken) return;

		const storedAuth = loadAuthFromStorage();
		if (!storedAuth?.expiresAt) return;

		const timeUntilExpiration = storedAuth.expiresAt - Date.now();
		const bufferTime = 5 * 60 * 1000;

		if (timeUntilExpiration <= 0) {
			return;
		}

		const refreshTime = Math.min(timeUntilExpiration - bufferTime, MAX_TIMEOUT_MS);
		if (refreshTime > 0) {
			const timer = setTimeout(async () => {
				try {
					const response = await apiPost<{
						id: string;
						accessToken: string;
						refreshToken: string;
						expiresIn?: number;
					}>(API_ROUTES.auth.refreshToken, { refreshToken }, { skipAuth: true });

					saveAuthToStorage({
						id: response.id,
						accessToken: response.accessToken,
						refreshToken: response.refreshToken,
						expiresAt: expiresInToExpiresAt(response.expiresIn),
					});

					dispatch(
						setAuth({
							id: response.id,
							accessToken: response.accessToken,
							refreshToken: response.refreshToken,
						}),
					);
				} catch {
					saveAuthToStorage(null);
					dispatch(clearAuth());
				}
			}, refreshTime);

			return () => clearTimeout(timer);
		}
	}, [authToken, refreshToken, dispatch]);

	return null;
}
