import { io, Socket } from "socket.io-client";
import { _constants } from "./constants";
import { store } from "@/store";
import type { ApiNotification } from "@/types/notifications";
import type { NotificationItem } from "@/types/notifications";
import { addNotification } from "@/store/notificationsSlice";

let socket: Socket | null = null;
let pendingJoin: { userId: string; role?: string } | null = null;

function getSocketBaseUrl() {
	// Use the API_URL in constants and remove any trailing /api segment
	const base = _constants.API_URL.replace(/\/api\/?$/, "");
	return base;
}

export function initSocket(token?: string) {
	if (!token) return;
	if (socket && socket.connected) return;

	const url = getSocketBaseUrl();
	socket = io(url, {
		path: "/socket.io",
		auth: { token },
		autoConnect: true,
	});

	socket.on("connect", () => {
		console.info("[socket] connected:", socket?.id);
		// If we were asked to join a room before connect, do it now
		if (pendingJoin) {
			socket?.emit("join", pendingJoin);
			pendingJoin = null;
		}
	});

	socket.on("connect_error", (err) => {
		console.warn("[socket] connect_error:", err);
	});

	socket.on("disconnect", (reason) => {
		console.info("[socket] disconnect:", reason);
	});

	socket.on("notification", (payload: ApiNotification | any) => {
		// Normalize different shaped payloads
		const normalized: NotificationItem = {
			id: payload?.data?.notificationId || payload.id || String(Date.now()),
			title: payload?.title || payload?.message || payload?.title || "Notification",
			subtitle: payload?.message || undefined,
			time: payload?.timestamp || payload?.createdAt || new Date().toISOString(),
			type: (typeof payload?.type === "string" ? payload.type : payload?.type?.type) || undefined,
			read: false,
		};

		try {
			store.dispatch(addNotification(normalized));
		} catch (e) {
			console.error("[socket] failed to dispatch notification", e);
		}

		// Show toast if Sonner is available
		import("sonner").then(({ toast }) => {
			try {
				const text = payload?.message || payload?.title || "New notification";
				toast(text);
			} catch (e) {
				// swallow
			}
		});
	});
}

export function disconnectSocket() {
	if (!socket) return;
	try {
		socket.disconnect();
	} catch (e) {
		// ignore
	}
	socket = null;
}

export function joinRoom(userId: string, role?: string) {
	if (!socket || !socket.connected) {
		// Save it and emit when connected
		pendingJoin = { userId, role };
		return;
	}
	socket.emit("join", { userId, role });
}

export default {
	initSocket,
	disconnectSocket,
	joinRoom,
};
