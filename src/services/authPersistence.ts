import { store } from "@/store";
import { setAuth } from "@/store/authSlice";

const KEY = "kkm_auth";

export function saveAuthToStorage(obj: { id?: string; accessToken?: string; refreshToken?: string } | null) {
	if (!obj) {
		localStorage.removeItem(KEY);
		return;
	}
	localStorage.setItem(KEY, JSON.stringify(obj));
}

export function loadAuthFromStorage() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return null;
		return JSON.parse(raw) as { id?: string; accessToken?: string; refreshToken?: string };
	} catch (e) {
		return null;
	}
}

export function hydrateAuth() {
	const data = loadAuthFromStorage();
	if (data) {
		store.dispatch(setAuth({ id: data.id ?? null, accessToken: data.accessToken ?? null, refreshToken: data.refreshToken ?? null }));
	}
}
