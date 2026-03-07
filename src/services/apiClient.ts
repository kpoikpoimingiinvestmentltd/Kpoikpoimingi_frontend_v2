import { store } from "@/store";
import { saveAuthToStorage, loadAuthFromStorage } from "./authPersistence";
import { API_ROUTES } from "@/api/routes";
import { _constants } from "./constants";
import { clearAuth } from "@/store/authSlice";
import { _router } from "../routes/_router";

type ApiRequestOptions = RequestInit & { skipAuth?: boolean };

let isRedirecting = false;
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

function resolveUrl(url: string) {
  return url.startsWith("http")
    ? url
    : `${_constants.API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function getTokenFromStore() {
  // Always read fresh from store — not from a snapshot taken before a refresh
  return (
    store.getState() as {
      auth?: { accessToken?: string; refreshToken?: string };
    }
  ).auth;
}

function handleSessionExpired() {
  if (isRedirecting) return;
  isRedirecting = true;
  store.dispatch(clearAuth());
  saveAuthToStorage(null);
  setTimeout(() => {
    isRedirecting = false;
    window.location.href = _router.auth.index;
  }, 100);
}

async function parseResponse(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : undefined;
  } catch {
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

  const expiresAt = data?.expiresIn
    ? Date.now() + data.expiresIn * 1000
    : undefined;

  saveAuthToStorage({
    id: data.id,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresAt,
  });

  // Update Redux so getTokenFromStore() returns the new token immediately
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

async function getValidToken(skipAuth: boolean): Promise<string | undefined> {
  if (skipAuth) return undefined;

  // Read from storage (source of truth for expiry) but token value from store
  const storedAuth = loadAuthFromStorage();

  // If token is expiring soon, refresh proactively — but only once at a time
  if (storedAuth?.expiresAt) {
    const fiveMinutes = 5 * 60 * 1000;
    const expiringSoon = Date.now() >= storedAuth.expiresAt - fiveMinutes;

    if (expiringSoon && storedAuth.refreshToken) {
      if (isRefreshing && refreshPromise) {
        await refreshPromise;
      } else if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = doRefresh(storedAuth.refreshToken)
          .catch(() => {}) // handleSessionExpired is called inside doRefresh on failure
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
        await refreshPromise;
      }
    }
  }

  // Read token AFTER any refresh has completed
  return getTokenFromStore()?.accessToken;
}

export async function apiRequest<T = unknown>(
  url: string,
  opts: ApiRequestOptions = {},
) {
  const skipAuth = !!opts.skipAuth;
  const token = await getValidToken(skipAuth);

  const headers: Record<string, string> = {
    ...((opts.headers as Record<string, string>) || {}),
  };
  if (!skipAuth && token) headers["Authorization"] = `Bearer ${token}`;

  const resolvedUrl = resolveUrl(url);
  const res = await fetch(resolvedUrl, { ...opts, headers });

  // Token was rejected — try one refresh then retry
  if (res.status === 401 && !skipAuth) {
    const refreshToken =
      getTokenFromStore()?.refreshToken ?? loadAuthFromStorage()?.refreshToken;
    try {
      const refreshed = await doRefresh(refreshToken);
      const retryHeaders = {
        ...((opts.headers as Record<string, string>) || {}),
        Authorization: `Bearer ${refreshed.accessToken}`,
      };
      const retry = await fetch(resolvedUrl, {
        ...opts,
        headers: retryHeaders,
      });
      const parsed = await parseResponse(retry);
      if (!retry.ok) {
        if (retry.status === 401) handleSessionExpired();
        throw Object.assign(new Error(parsed?.message || retry.statusText), {
          status: retry.status,
          data: parsed,
        });
      }
      return parsed as T;
    } catch (e) {
      if ((e as any)?.status === 401) handleSessionExpired();
      throw e;
    }
  }

  const data = await parseResponse(res);
  if (!res.ok) {
    throw Object.assign(new Error(data?.message || res.statusText), {
      status: res.status,
      data,
    });
  }
  return data as T;
}

// Convenience methods
export async function apiPost<T = unknown>(
  url: string,
  body: unknown,
  opts: ApiRequestOptions = {},
) {
  return apiRequest<T>(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
}

export async function apiGet<T = unknown>(
  url: string,
  opts: ApiRequestOptions = {},
) {
  return apiRequest<T>(url, { method: "GET", ...opts });
}

export async function apiPut<T = unknown>(
  url: string,
  body: unknown,
  opts: ApiRequestOptions = {},
) {
  return apiRequest<T>(url, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
}

export async function apiPatch<T = unknown>(
  url: string,
  body: unknown,
  opts: ApiRequestOptions = {},
) {
  return apiRequest<T>(url, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
}

export async function apiDelete<T = unknown>(
  url: string,
  opts: ApiRequestOptions = {},
) {
  return apiRequest<T>(url, { method: "DELETE", ...opts });
}

export async function apiGetFile(url: string, opts: ApiRequestOptions = {}) {
  const skipAuth = !!opts.skipAuth;
  const token = await getValidToken(skipAuth);

  const headers: Record<string, string> = {
    ...((opts.headers as Record<string, string>) || {}),
  };
  if (!skipAuth && token) headers["Authorization"] = `Bearer ${token}`;

  const resolvedUrl = resolveUrl(url);
  const res = await fetch(resolvedUrl, { ...opts, headers });

  if (res.status === 401 && !skipAuth) {
    const refreshToken =
      getTokenFromStore()?.refreshToken ?? loadAuthFromStorage()?.refreshToken;
    try {
      const refreshed = await doRefresh(refreshToken);
      const retryHeaders = {
        ...((opts.headers as Record<string, string>) || {}),
        Authorization: `Bearer ${refreshed.accessToken}`,
      };
      const retry = await fetch(resolvedUrl, {
        ...opts,
        headers: retryHeaders,
      });
      if (!retry.ok) {
        if (retry.status === 401) handleSessionExpired();
        const errorText = await retry.text();
        let parsedError: unknown = errorText;
        try {
          parsedError = JSON.parse(errorText);
        } catch {}
        throw Object.assign(
          new Error((parsedError as any)?.message ?? retry.statusText),
          { status: retry.status, data: parsedError },
        );
      }
      return await retry.blob();
    } catch (e) {
      if ((e as any)?.status === 401) handleSessionExpired();
      throw e;
    }
  }

  if (!res.ok) {
    const text = await res.text();
    let parsed: unknown = text;
    try {
      parsed = JSON.parse(text);
    } catch {}
    throw Object.assign(new Error((parsed as any)?.message ?? res.statusText), {
      status: res.status,
      data: parsed,
    });
  }

  return await res.blob();
}
