import { getLatestUpdateId } from "@/config/productUpdates";

const KEY_PREFIX = "kkm_whats_new_seen";

function storageKey(userId?: string | null) {
	return `${KEY_PREFIX}:${userId || "anon"}`;
}

export function getSeenUpdateId(userId?: string | null): string | null {
	try {
		return localStorage.getItem(storageKey(userId));
	} catch {
		return null;
	}
}

export function markUpdatesSeen(userId?: string | null, updateId?: string | null) {
	const id = updateId ?? getLatestUpdateId();
	if (!id) return;
	try {
		localStorage.setItem(storageKey(userId), id);
	} catch {
		/* ignore quota / private mode */
	}
}

export function hasUnseenUpdates(userId?: string | null): boolean {
	const latest = getLatestUpdateId();
	if (!latest) return false;
	return getSeenUpdateId(userId) !== latest;
}
