import { store } from "@/store";
import { setAuth } from "@/store/authSlice";

const KEY = "kkm_auth";

export interface StoredAuthData {
	id?: string;
	accessToken?: string;
	refreshToken?: string;
	expiresAt?: number; // Timestamp when token expires
}

export function saveAuthToStorage(obj: StoredAuthData | null) {
	if (!obj) {
		localStorage.removeItem(KEY);
		return;
	}
	localStorage.setItem(KEY, JSON.stringify(obj));
}

export function loadAuthFromStorage(): StoredAuthData | null {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return null;
		return JSON.parse(raw) as StoredAuthData;
	} catch (e) {
		return null;
	}
}

export function isTokenExpired(expiresAt?: number): boolean {
	if (!expiresAt) return false;
	return Date.now() >= expiresAt;
}

export function isTokenExpiringsoon(expiresAt?: number, bufferMs: number = 60000): boolean {
	if (!expiresAt) return false;
	return Date.now() >= expiresAt - bufferMs;
}

export function hydrateAuth() {
	const data = loadAuthFromStorage();
	if (data && data.accessToken) {
		// Check if token is expired
		if (!isTokenExpired(data.expiresAt)) {
			store.dispatch(
				setAuth({
					id: data.id ?? null,
					accessToken: data.accessToken ?? null,
					refreshToken: data.refreshToken ?? null,
				}),
			);
		} else {
			// Token is expired, clear it
			localStorage.removeItem(KEY);
		}
	}
}
