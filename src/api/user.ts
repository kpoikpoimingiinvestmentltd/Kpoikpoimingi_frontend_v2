import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import { store } from "@/store";
import type { ChangePasswordInput, User, ResetPasswordResponse } from "@/types/user";

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
	const id = (store.getState() as any)?.auth?.id;
	return useQuery<User>({
		queryKey: ["currentUser", id],
		queryFn: async () => getUserById(id!),
		enabled: !!id && enabled,
	} as any);
}

export async function updateUserRequest(id: string, payload: any) {
	return apiPost(API_ROUTES.user.updateUser(id), payload);
}

export function useUpdateUser() {
	return useMutation({
		mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
			const data = await updateUserRequest(id, payload);
			return data;
		},
	});
}

// --- create user ---
export async function createUserRequest(payload: any) {
	return apiPost(API_ROUTES.user.createUser, payload);
}

export function useCreateUser() {
	return useMutation<any, unknown, any>({
		mutationFn: async (payload: any) => {
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
