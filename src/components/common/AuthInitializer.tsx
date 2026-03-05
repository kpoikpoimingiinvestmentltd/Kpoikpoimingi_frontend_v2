import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { isTokenExpiringSoon, loadAuthFromStorage } from "@/services/authPersistence";
import { apiPost } from "@/services/apiClient";
import { API_ROUTES } from "@/api/routes";
import { setAuth } from "@/store/authSlice";
import { saveAuthToStorage } from "@/services/authPersistence";

export function AuthInitializer() {
	const dispatch = useDispatch();
	const authToken = useSelector((state: RootState) => state.auth.accessToken);
	const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);
	const initializeRef = useRef(false);

	useEffect(() => {
		if (initializeRef.current) return; // Prevent multiple initializations
		initializeRef.current = true;

		const initializeAuth = async () => {
			const storedAuth = loadAuthFromStorage();

			// No stored auth data, nothing to do
			if (!storedAuth || !storedAuth.accessToken) {
				return;
			}

			// Token is expiring soon, refresh it
			if (storedAuth.expiresAt && isTokenExpiringSoon(storedAuth.expiresAt)) {
				if (storedAuth.refreshToken) {
					try {
						const response = await apiPost<{
							id: string;
							accessToken: string;
							refreshToken: string;
							expiresIn?: number;
						}>(API_ROUTES.auth.refreshToken, { refreshToken: storedAuth.refreshToken });

						const expiresAt = response.expiresIn ? Date.now() + response.expiresIn * 1000 : undefined;

						saveAuthToStorage({
							id: response.id,
							accessToken: response.accessToken,
							refreshToken: response.refreshToken,
							expiresAt,
						});

						dispatch(
							setAuth({
								id: response.id,
								accessToken: response.accessToken,
								refreshToken: response.refreshToken,
							}),
						);
					} catch (error) {
						// Refresh failed, clear auth
						saveAuthToStorage(null);
						dispatch(setAuth({ id: null, accessToken: null, refreshToken: null }));
					}
				} else {
					// No refresh token, clear auth
					saveAuthToStorage(null);
					dispatch(setAuth({ id: null, accessToken: null, refreshToken: null }));
				}
			}
		};

		initializeAuth();
	}, [dispatch]);

	// Auto-refresh token when expiring soon
	useEffect(() => {
		if (!refreshToken || !authToken) return;

		const storedAuth = loadAuthFromStorage();
		if (!storedAuth?.expiresAt) return;

		// Calculate time until expiration
		const timeUntilExpiration = storedAuth.expiresAt - Date.now();
		const bufferTime = 5 * 60 * 1000; // Refresh 5 minutes before expiration

		if (timeUntilExpiration <= 0) {
			// Already expired, don't set a timer
			return;
		}

		// Set a timer to refresh before expiration
		const refreshTime = timeUntilExpiration - bufferTime;
		if (refreshTime > 0) {
			const timer = setTimeout(async () => {
				try {
					const response = await apiPost<{
						id: string;
						accessToken: string;
						refreshToken: string;
						expiresIn?: number;
					}>(API_ROUTES.auth.refreshToken, { refreshToken });

					const expiresAt = response.expiresIn ? Date.now() + response.expiresIn * 1000 : undefined;

					saveAuthToStorage({
						id: response.id,
						accessToken: response.accessToken,
						refreshToken: response.refreshToken,
						expiresAt,
					});

					dispatch(
						setAuth({
							id: response.id,
							accessToken: response.accessToken,
							refreshToken: response.refreshToken,
						}),
					);
				} catch (error) {
					// Refresh failed, clear auth
					saveAuthToStorage(null);
					dispatch(setAuth({ id: null, accessToken: null, refreshToken: null }));
				}
			}, refreshTime);

			return () => clearTimeout(timer);
		}
	}, [authToken, refreshToken, dispatch]);

	return null; // This component doesn't render anything
}
