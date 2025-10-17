import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import type { ChangePasswordInput, User } from "@/types/user";

export async function getUserById(id: string) {
	return apiGet(API_ROUTES.user.getUserById(id));
}

export function useGetUser(id?: string) {
	return useQuery({
		queryKey: ["user", id],
		queryFn: async () => getUserById(id!),
		enabled: !!id,
	} as any);
}

export async function changePassword(payload: ChangePasswordInput) {
	return apiPost(API_ROUTES.user.changePassword, payload);
}

export function useChangePassword(onSuccess?: () => void) {
	return useMutation({
		mutationFn: async (payload: ChangePasswordInput) => {
			const data = await changePassword(payload as ChangePasswordInput);
			return data;
		},
		onSuccess: () => onSuccess?.(),
	});
}

// --- users list ---
export async function getAllUsers(): Promise<User[]> {
	return apiGet(API_ROUTES.user.getAllUsers) as Promise<User[]>;
}

export function useGetAllUsers(enabled = true) {
	const qc = useQueryClient();
	return useQuery<User[]>({
		queryKey: ["users"],
		queryFn: async () => getAllUsers(),
		enabled,
		// keep previous data to avoid flicker
		keepPreviousData: true,
		onSuccess: (data: User[] | undefined) => {
			// populate cache or do side effects as needed
			if (data) qc.setQueryData(["users"], data);
		},
	} as any);
}

export function useGetCurrentUser(enabled = true) {
	return useQuery<User>({
		queryKey: ["currentUser"],
		queryFn: async () => apiGet(API_ROUTES.user.getCurrentUserProfile) as Promise<User>,
		enabled,
	} as any);
}
