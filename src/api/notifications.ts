import { useQuery, useMutation } from "@tanstack/react-query";
import { apiGet, apiPut } from "@/services/apiClient";
import { API_ROUTES } from "./routes";

export type Pagination = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

export type NotificationsResponse<T = any> = {
	data: T[];
	pagination: Pagination;
};

export async function getNotifications(page = 1, limit = 20) {
	const qs = `?page=${page}&limit=${limit}`;
	return apiGet<NotificationsResponse>(`${API_ROUTES.notifications.getNotifications}${qs}`);
}

export function useGetNotifications(page = 1, limit = 20, enabled = true) {
	return useQuery<NotificationsResponse, unknown>({
		queryKey: ["notifications", page, limit],
		queryFn: async () => await getNotifications(page, limit),
		enabled,
		keepPreviousData: true,
	} as any);
}

export async function getUnreadNotificationCount() {
	return apiGet<number>(API_ROUTES.notifications.getUnreadNotificationCount) as Promise<number>;
}

export function useGetUnreadNotificationCount(enabled = true) {
	return useQuery<number, unknown>({
		queryKey: ["notifications", "unreadCount"],
		queryFn: async () => await getUnreadNotificationCount(),
		enabled,
		// refresh periodically
		staleTime: 30_000,
	} as any);
}

export async function markAllNotificationsRead() {
	// API expects PUT /notifications/mark-all-read
	return apiPut<{ count: number }>(API_ROUTES.notifications.markAllNotificationsRead, {});
}

export function useMarkAllNotificationsRead() {
	return useMutation<{ count: number }, unknown, void>({
		mutationFn: async () => {
			const data = await markAllNotificationsRead();
			return data;
		},
	} as any);
}
