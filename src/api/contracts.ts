import { useMutation, useQuery } from "@tanstack/react-query";
import { apiPost, apiGet } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import type { InternalFullPaymentRegistrationPayload, FullPaymentRegistrationResponse } from "@/types/customerRegistration";

export async function createContractRequest(payload: any) {
	return apiPost(API_ROUTES.contracts.createContract, payload);
}

export function useCreateContract(onSuccess?: (data: any) => void, onError?: (err: any) => void) {
	return useMutation<any, unknown, any>({
		mutationFn: async (payload: any) => {
			const data = await createContractRequest(payload);
			return data;
		},
		onSuccess: (data) => onSuccess?.(data),
		onError: (err) => onError?.(err),
	});
}

export async function getAllContracts(page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc") {
	const params = new URLSearchParams();
	params.append("page", String(page));
	params.append("limit", String(limit));
	if (search) params.append("search", search);
	params.append("sortBy", sortBy);
	params.append("sortOrder", sortOrder);
	return apiGet(`${API_ROUTES.contracts.getAllContracts}?${params.toString()}`) as Promise<{ pagination: any; data: any[] }>;
}

export function useGetAllContracts(page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc", enabled = true) {
	return useQuery({
		queryKey: ["contracts", page, limit, search, sortBy, sortOrder],
		queryFn: () => getAllContracts(page, limit, search, sortBy, sortOrder),
		enabled,
	} as any);
}

export async function getAllContractDebts(page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc") {
	const params = new URLSearchParams();
	params.append("page", String(page));
	params.append("limit", String(limit));
	if (search) params.append("search", search);
	params.append("sortBy", sortBy);
	params.append("sortOrder", sortOrder);
	return apiGet(`${API_ROUTES.contracts.getAllContractDebts}?${params.toString()}`) as Promise<{
		pagination: any;
		data: any[];
		summary: {
			totalCustomersOwing: number;
			totalContracts: number;
			totalDebtAmount: number;
			totalAmountPaid: number;
			totalOverdueContracts: number;
		};
	}>;
}

export function useGetAllContractDebts(page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc", enabled = true) {
	return useQuery({
		queryKey: ["contract-debts", page, limit, search, sortBy, sortOrder],
		queryFn: () => getAllContractDebts(page, limit, search, sortBy, sortOrder),
		enabled,
	} as any);
}

export async function getContractById(id: string) {
	return apiGet(API_ROUTES.contracts.getContractHistory(id)) as Promise<any>;
}

export function useGetContractById(id: string, enabled = true) {
	return useQuery({
		queryKey: ["contract", id],
		queryFn: () => getContractById(id),
		enabled,
	} as any);
}

export async function getAllCustomerRegistrations() {
	return apiGet(API_ROUTES.customerRegistration.getAllCustomerRegistrations) as Promise<{ pagination: any; data: any[] }>;
}

export function useGetAllCustomerRegistrations(enabled = true) {
	return useQuery({
		queryKey: ["customer-registrations"],
		queryFn: () => getAllCustomerRegistrations(),
		enabled,
	} as any);
}

export async function createInternalFullPaymentRegistration(payload: InternalFullPaymentRegistrationPayload) {
	return apiPost<FullPaymentRegistrationResponse>(
		API_ROUTES.customerRegistration.createInternalFullPaymentRegistration,
		payload
	) as Promise<FullPaymentRegistrationResponse>;
}

export function useCreateInternalFullPaymentRegistration(onSuccess?: (data: FullPaymentRegistrationResponse) => void, onError?: (err: any) => void) {
	return useMutation<FullPaymentRegistrationResponse, Error, InternalFullPaymentRegistrationPayload>({
		mutationFn: (payload: InternalFullPaymentRegistrationPayload) => createInternalFullPaymentRegistration(payload),
		onSuccess,
		onError,
	});
}

export async function pauseContract(id: string, payload: { reason: string }) {
	return apiPost(API_ROUTES.contracts.pauseContract(id), payload);
}

export function usePauseContract(onSuccess?: (data: any) => void, onError?: (err: any) => void) {
	return useMutation<any, unknown, { id: string; reason: string }>({
		mutationFn: async ({ id, reason }) => {
			return pauseContract(id, { reason });
		},
		onSuccess: (data) => onSuccess?.(data),
		onError: (err) => onError?.(err),
	});
}

export async function resumeContract(id: string) {
	return apiPost(API_ROUTES.contracts.resumeContract(id), {});
}

export function useResumeContract(onSuccess?: (data: any) => void, onError?: (err: any) => void) {
	return useMutation<any, unknown, string>({
		mutationFn: (id: string) => resumeContract(id),
		onSuccess: (data) => onSuccess?.(data),
		onError: (err) => onError?.(err),
	});
}

export async function getPaymentSchedules(contractId: string) {
	return apiGet(API_ROUTES.paymentSchedule.getPaymentSchedules(contractId)) as Promise<any[]>;
}

export function useGetPaymentSchedules(contractId: string, enabled = true) {
	return useQuery({
		queryKey: ["payment-schedules", contractId],
		queryFn: () => getPaymentSchedules(contractId),
		enabled: !!contractId && enabled,
	} as any);
}
