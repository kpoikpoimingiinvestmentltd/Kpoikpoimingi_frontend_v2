import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { initSocket, disconnectSocket, joinRoom } from "@/services/notificationsSocket";
import { useGetCurrentUser } from "@/api/user";

export const NotificationsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const auth = useSelector((state: RootState) => state.auth);
	const { data: currentUser } = useGetCurrentUser(true);
	const lastTokenRef = useRef<string | null>(null);

	useEffect(() => {
		const token = auth?.accessToken ?? null;

		// Avoid disconnect/reconnect loops when the same token is re-delivered
		if (token && token === lastTokenRef.current) {
			return;
		}

		if (!token) {
			lastTokenRef.current = null;
			disconnectSocket();
			return;
		}

		lastTokenRef.current = token;
		disconnectSocket();
		initSocket(token);
	}, [auth?.accessToken]);

	useEffect(() => {
		const userData = currentUser as Record<string, unknown> | undefined;
		const id = userData?.id as string | undefined;
		const role = userData?.role as string | undefined;
		if (id) {
			joinRoom(id, role);
		}
	}, [currentUser]);

	return <>{children}</>;
};

export default NotificationsProvider;
