import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiDelete, apiPut } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import { store } from "@/store";
import type { ChangePasswordInput, ResetPasswordResponse } from "@/types/user";

export async function resetPasswordRequest(userId: string) {
	return apiPost(API_ROUTES.user.resetPassword(userId), {});
}

export async function getUserById(id: string) {
	return apiGet(API_ROUTES.user.getUserById(id));
}

export function useGetUser(id?: string) {
	return useQuery({
		queryKey: ["user", id],
		queryFn: async () => getUserById(id!),
		enabled: !!id,
	});
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

export function useResetPassword() {
	return useMutation<ResetPasswordResponse, unknown, string>({
		mutationFn: async (userId: string) => {
			const data = await resetPasswordRequest(userId);
			return data as ResetPasswordResponse;
		},
	});
}

export async function suspendUserRequest(userId: string) {
	return apiPost(API_ROUTES.user.suspendUser(userId), {});
}

export function useSuspendUser() {
	return useMutation<any, unknown, string>({
		mutationFn: async (userId: string) => {
			const data = await suspendUserRequest(userId);
			return data;
		},
	});
}

// --- users list ---
export async function getAllUsers(page?: number, limit?: number, search?: string, sortBy?: string, sortOrder?: string): Promise<unknown> {
	const qs = new URLSearchParams();
	if (typeof page === "number") qs.append("page", String(page));
	if (typeof limit === "number") qs.append("limit", String(limit));
	if (search) qs.append("search", search);
	if (sortBy) qs.append("sortBy", sortBy);
	if (sortOrder) qs.append("sortOrder", sortOrder);

	const url = `${API_ROUTES.user.getAllUsers}${qs.toString() ? `?${qs.toString()}` : ""}`;
	return apiGet(url);
}

export function useGetAllUsers(page = 1, limit = 10, search?: string, sortBy?: string, sortOrder?: string, enabled = true) {
	return useQuery({
		queryKey: ["users", page, limit, search || "", sortBy || "", sortOrder || ""],
		queryFn: async () => getAllUsers(page, limit, search, sortBy, sortOrder),
		enabled,
		staleTime: 5 * 60 * 1000,
	});
}

export function useGetCurrentUser(enabled = true) {
	const stateData = store.getState() as Record<string, unknown>;
	const authData = stateData?.auth as Record<string, unknown> | undefined;
	const id = authData?.id as string | undefined;
	return useQuery<unknown>({
		queryKey: ["currentUser", id],
		queryFn: async () => getUserById(id!),
		enabled: !!id && enabled,
	});
}

export async function updateUserRequest(id: string, payload: unknown) {
	return apiPut(API_ROUTES.user.updateUser(id), payload);
}

export function useUpdateUser() {
	return useMutation({
		mutationFn: async ({ id, payload }: { id: string; payload: unknown }) => {
			const data = await updateUserRequest(id, payload);
			return data;
		},
	});
}

// --- create user ---
export async function createUserRequest(payload: unknown) {
	return apiPost(API_ROUTES.user.createUser, payload);
}

export function useCreateUser() {
	return useMutation<unknown, unknown, unknown>({
		mutationFn: async (payload: unknown) => {
			const data = await createUserRequest(payload);
			return data;
		},
	});
}

export async function uploadUserProfileRequest(userId: string, key: string) {
	return apiPost(API_ROUTES.user.uploadUserProfile(userId), { key });
}

export function useUploadUserProfile() {
	return useMutation<any, unknown, { userId: string; key: string }>({
		mutationFn: async ({ userId, key }) => {
			const data = await uploadUserProfileRequest(userId, key);
			return data;
		},
	});
}

// --- delete user ---
export async function deleteUserRequest(userId: string) {
	return apiDelete(API_ROUTES.user.deleteUser(userId));
}

export function useDeleteUser() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (userId: string) => {
			const data = await deleteUserRequest(userId);
			return data;
		},
		onSettled: () => qc.invalidateQueries({ queryKey: ["users"] }),
	});
}
