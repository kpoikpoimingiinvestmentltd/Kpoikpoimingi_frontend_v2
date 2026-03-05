import { store } from "@/store";
import { setAuth } from "@/store/authSlice";

const KEY = "kkm_auth";

export interface StoredAuthData {
	id?: string;
	accessToken?: string;
	refreshToken?: string;
	expiresAt?: number;
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
	} catch {
		return null;
	}
}

export function isTokenExpired(expiresAt?: number): boolean {
	if (!expiresAt) return false;
	return Date.now() >= expiresAt;
}

// Only flag as "expiring soon" if within 5 minutes — not 60 seconds.
// A too-small buffer causes every request to attempt a refresh.
export function isTokenExpiringSoon(expiresAt?: number, bufferMs: number = 5 * 60 * 1000): boolean {
	if (!expiresAt) return false;
	return Date.now() >= expiresAt - bufferMs;
}

export function hydrateAuth() {
	const data = loadAuthFromStorage();
	if (data?.accessToken && !isTokenExpired(data.expiresAt)) {
		store.dispatch(
			setAuth({
				id: data.id ?? null,
				accessToken: data.accessToken,
				refreshToken: data.refreshToken ?? null,
			}),
		);
	} else {
		// Token is expired or missing — clear storage so user starts fresh
		localStorage.removeItem(KEY);
	}
}
