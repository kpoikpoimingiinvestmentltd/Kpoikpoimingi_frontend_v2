import { useQuery, useMutation } from "@tanstack/react-query";
import { apiGet, apiPut } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import type { NotificationsApiResponse as NotificationsRespType } from "@/types/notifications";

export type Pagination = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

export async function getNotifications(page = 1, limit = 20): Promise<NotificationsRespType> {
	const qs = `?page=${page}&limit=${limit}`;
	return apiGet<NotificationsRespType>(`${API_ROUTES.notifications.getNotifications}${qs}`) as Promise<NotificationsRespType>;
}

export function useGetNotifications(page = 1, limit = 20, enabled = true): UseQueryResult<NotificationsRespType, unknown> {
	return useQuery({
		queryKey: ["notifications", page, limit],
		queryFn: async () => await getNotifications(page, limit),
		enabled,
	}) as UseQueryResult<NotificationsRespType, unknown>;
}

export async function getUnreadNotificationCount(): Promise<number> {
	return apiGet<number>(API_ROUTES.notifications.getUnreadNotificationCount) as Promise<number>;
}

export function useGetUnreadNotificationCount(enabled = true): UseQueryResult<number, unknown> {
	return useQuery({
		queryKey: ["notifications", "unreadCount"],
		queryFn: async () => await getUnreadNotificationCount(),
		enabled,
		staleTime: 30_000,
	}) as UseQueryResult<number, unknown>;
}

export async function markAllNotificationsRead(): Promise<{ count: number }> {
	// API expects PUT /notifications/mark-all-read
	return apiPut<{ count: number }>(API_ROUTES.notifications.markAllNotificationsRead, {});
}

export function useMarkAllNotificationsRead(): UseMutationResult<{ count: number }, unknown, void> {
	return useMutation({
		mutationFn: async () => {
			const data = await markAllNotificationsRead();
			return data;
		},
	}) as UseMutationResult<{ count: number }, unknown, void>;
}
