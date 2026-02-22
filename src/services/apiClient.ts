import { store } from "@/store";
import { saveAuthToStorage } from "./authPersistence";
import { API_ROUTES } from "@/api/routes";
import { _constants } from "./constants";
import { clearAuth } from "@/store/authSlice";
import { _router } from "../routes/_router";

type ApiRequestOptions = RequestInit & { skipAuth?: boolean };

let isRedirecting = false;

function resolveUrl(url: string) {
	return url.startsWith("http") ? url : `${_constants.API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function apiPost<T = unknown>(url: string, body: unknown, opts: ApiRequestOptions = {}) {
	return apiRequest<T>(url, {
		method: "POST",
		body: JSON.stringify(body),
		headers: { "Content-Type": "application/json" },
		...opts,
	});
}

export async function apiGet<T = unknown>(url: string, opts: ApiRequestOptions = {}) {
	return apiRequest<T>(url, { method: "GET", ...opts });
}

export async function apiPut<T = unknown>(url: string, body: unknown, opts: ApiRequestOptions = {}) {
	return apiRequest<T>(url, {
		method: "PUT",
		body: JSON.stringify(body),
		headers: { "Content-Type": "application/json" },
		...opts,
	});
}

export async function apiPatch<T = unknown>(url: string, body: unknown, opts: ApiRequestOptions = {}) {
	return apiRequest<T>(url, {
		method: "PATCH",
		body: JSON.stringify(body),
		headers: { "Content-Type": "application/json" },
		...opts,
	});
}

export async function apiDelete<T = unknown>(url: string, opts: ApiRequestOptions = {}) {
	return apiRequest<T>(url, { method: "DELETE", ...opts });
}

export async function apiGetFile(url: string, opts: ApiRequestOptions = {}) {
	const state = store.getState() as {
		auth?: { accessToken?: string; refreshToken?: string };
	};
	const token = state?.auth?.accessToken;
	const skipAuth = !!opts.skipAuth;

	const headers: Record<string, string> = {
		...((opts.headers as Record<string, string>) || {}),
	};
	if (!skipAuth && token) headers["Authorization"] = `Bearer ${token}`;

	const resolvedUrl = resolveUrl(url);
	const res = await fetch(resolvedUrl, { ...opts, headers });
	if (res.status === 401 && !skipAuth) {
		const refreshToken = state?.auth?.refreshToken;
		try {
			const refreshed = await doRefresh(refreshToken);
			const newToken = refreshed.accessToken;
			const retryHeaders = {
				...((opts.headers as Record<string, string>) || {}),
				Authorization: `Bearer ${newToken}`,
			};
			const retry = await fetch(resolvedUrl, {
				...opts,
				headers: retryHeaders,
			});
			if (!retry.ok) {
				if (retry.status === 401) {
					handleSessionExpired();
				}
				// Try to parse textual error
				const errorText = await retry.text();
				let parsedError: unknown = errorText;
				try {
					parsedError = JSON.parse(errorText);
				} catch (e) {}
				throw Object.assign(new Error((parsedError as any)?.message ?? retry.statusText), { status: retry.status, data: parsedError });
			}
			return await retry.blob();
		} catch (e) {
			if ((e as Record<string, unknown>)?.status === 401) {
				handleSessionExpired();
			}
			throw e;
		}
	}
	if (res.status === 401 && !skipAuth) {
		handleSessionExpired();
	}

	if (!res.ok) {
		const text = await res.text();
		let parsed: unknown = text;
		try {
			parsed = JSON.parse(text);
		} catch (e) {}
		throw Object.assign(new Error((parsed as any)?.message ?? res.statusText), {
			status: res.status,
			data: parsed,
		});
	}

	return await res.blob();
}

async function parseResponse(res: Response) {
	const text = await res.text();
	try {
		return text ? JSON.parse(text) : undefined;
	} catch (e) {
		return text;
	}
}

async function doRefresh(refreshToken?: string) {
	if (!refreshToken) {
		handleSessionExpired();
		throw new Error("No refresh token available");
	}
	const res = await fetch(resolveUrl(API_ROUTES.auth.refreshToken), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ refreshToken }),
	});
	const data = await parseResponse(res);
	if (!res.ok) {
		handleSessionExpired();
		throw Object.assign(new Error(data?.message || res.statusText), {
			status: res.status,
			data,
		});
	}
	saveAuthToStorage({
		id: data.id,
		accessToken: data.accessToken,
		refreshToken: data.refreshToken,
	});
	store.dispatch({
		type: "auth/setAuth",
		payload: {
			id: data.id,
			accessToken: data.accessToken,
			refreshToken: data.refreshToken,
		},
	});
	return data;
}

function handleSessionExpired() {
	if (isRedirecting) return;
	isRedirecting = true;

	store.dispatch(clearAuth());
	saveAuthToStorage(null);
	setTimeout(() => {
		window.location.href = _router.auth.index;
	}, 100);
}

export async function apiRequest<T = unknown>(url: string, opts: ApiRequestOptions = {}) {
	const state = store.getState() as {
		auth?: { accessToken?: string; refreshToken?: string };
	};
	const token = state?.auth?.accessToken;
	const skipAuth = !!opts.skipAuth;

	const headers: Record<string, string> = {
		...((opts.headers as Record<string, string>) || {}),
	};
	if (!skipAuth && token) headers["Authorization"] = `Bearer ${token}`;

	const resolvedUrl = resolveUrl(url);
	const res = await fetch(resolvedUrl, { ...opts, headers });
	if (res.status === 401 && !skipAuth) {
		const refreshToken = state?.auth?.refreshToken;
		try {
			const refreshed = await doRefresh(refreshToken);
			const newToken = refreshed.accessToken;
			const retryHeaders = {
				...((opts.headers as Record<string, string>) || {}),
				Authorization: `Bearer ${newToken}`,
			};
			const retry = await fetch(resolvedUrl, {
				...opts,
				headers: retryHeaders,
			});
			const parsed = await parseResponse(retry);
			if (!retry.ok) {
				// If retry also fails with 401, handle session expiration
				if (retry.status === 401) {
					handleSessionExpired();
				}
				throw Object.assign(new Error(parsed?.message || retry.statusText), {
					status: retry.status,
					data: parsed,
				});
			}
			return parsed as T;
		} catch (e) {
			// If any error occurred during refresh process, check if we should redirect
			if ((e as Record<string, unknown>)?.status === 401) {
				handleSessionExpired();
			}
			throw e;
		}
	}
	if (res.status === 401 && !skipAuth) {
		handleSessionExpired();
	}

	const data = await parseResponse(res);
	if (!res.ok)
		throw Object.assign(new Error(data?.message || res.statusText), {
			status: res.status,
			data,
		});
	return data as T;
}
