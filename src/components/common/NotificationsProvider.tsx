import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { initSocket, disconnectSocket, joinRoom } from "@/services/notificationsSocket";
import { useGetCurrentUser } from "@/api/user";

export const NotificationsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const auth = useSelector((state: RootState) => state.auth);
	const { data: currentUser } = useGetCurrentUser(true);

	useEffect(() => {
		const token = auth?.accessToken ?? undefined;
		if (token) {
			disconnectSocket();
			initSocket(token);
		} else {
			disconnectSocket();
		}

		return () => {};
	}, [auth?.accessToken]);

	useEffect(() => {
		const id = (currentUser as any)?.id as string | undefined;
		const role = (currentUser as any)?.role as string | undefined;
		if (id) {
			joinRoom(id, role);
		}
	}, [currentUser]);

	return <>{children}</>;
};

export default NotificationsProvider;
