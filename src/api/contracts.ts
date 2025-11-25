import { useMutation, useQuery } from "@tanstack/react-query";
import { apiPost, apiGet } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import type { InternalFullPaymentRegistrationPayload, FullPaymentRegistrationResponse } from "@/types/customerRegistration";

type ListResponse<T = unknown> = {
	pagination?: Record<string, unknown> | null;
	data: T[];
};

export type CreateContractRequest = Record<string, unknown>;

export async function createContractRequest(payload: CreateContractRequest) {
	return apiPost(API_ROUTES.contracts.createContract, payload);
}

export function useCreateContract(onSuccess?: (data: unknown) => void, onError?: (err: unknown) => void) {
	return useMutation<unknown, unknown, CreateContractRequest>({
		mutationFn: async (payload: CreateContractRequest) => {
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
	return apiGet(`${API_ROUTES.contracts.getAllContracts}?${params.toString()}`) as Promise<ListResponse>;
}

export function useGetAllContracts(page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc", enabled = true) {
	return useQuery<ListResponse, unknown>({
		queryKey: ["contracts", page, limit, search, sortBy, sortOrder],
		queryFn: () => getAllContracts(page, limit, search, sortBy, sortOrder),
		enabled,
	});
}

export async function getAllContractDebts(page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc") {
	const params = new URLSearchParams();
	params.append("page", String(page));
	params.append("limit", String(limit));
	if (search) params.append("search", search);
	params.append("sortBy", sortBy);
	params.append("sortOrder", sortOrder);
	return apiGet(`${API_ROUTES.contracts.getAllContractDebts}?${params.toString()}`) as Promise<
		ListResponse & {
			summary: {
				totalCustomersOwing: number;
				totalContracts: number;
				totalDebtAmount: number;
				totalAmountPaid: number;
				totalOverdueContracts: number;
			};
		}
	>;
}

export function useGetAllContractDebts(page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc", enabled = true) {
	return useQuery<ListResponse & { summary: Record<string, unknown> }, unknown>({
		queryKey: ["contract-debts", page, limit, search, sortBy, sortOrder],
		queryFn: () => getAllContractDebts(page, limit, search, sortBy, sortOrder),
		enabled,
	});
}

export async function getContractById(id: string) {
	return apiGet(API_ROUTES.contracts.getContractHistory(id)) as Promise<Record<string, unknown>>;
}

export function useGetContractById(id: string, enabled = true) {
	return useQuery<Record<string, unknown>, unknown>({
		queryKey: ["contract", id],
		queryFn: () => getContractById(id),
		enabled,
	});
}

export async function getAllCustomerRegistrations() {
	return apiGet(API_ROUTES.customerRegistration.getAllCustomerRegistrations) as Promise<ListResponse<Record<string, unknown>>>;
}

export function useGetAllCustomerRegistrations(enabled = true) {
	return useQuery<ListResponse<Record<string, unknown>>, unknown>({
		queryKey: ["customer-registrations"],
		queryFn: () => getAllCustomerRegistrations(),
		enabled,
	});
}

export async function createInternalFullPaymentRegistration(payload: InternalFullPaymentRegistrationPayload) {
	return apiPost<FullPaymentRegistrationResponse>(
		API_ROUTES.customerRegistration.createInternalFullPaymentRegistration,
		payload
	) as Promise<FullPaymentRegistrationResponse>;
}

export function useCreateInternalFullPaymentRegistration(
	onSuccess?: (data: FullPaymentRegistrationResponse) => void,
	onError?: (err: unknown) => void
) {
	return useMutation<FullPaymentRegistrationResponse, Error, InternalFullPaymentRegistrationPayload>({
		mutationFn: (payload: InternalFullPaymentRegistrationPayload) => createInternalFullPaymentRegistration(payload),
		onSuccess,
		onError,
	});
}

export async function pauseContract(id: string, payload: { reason: string }) {
	return apiPost(API_ROUTES.contracts.pauseContract(id), payload);
}

export function usePauseContract(onSuccess?: (data: unknown) => void, onError?: (err: unknown) => void) {
	return useMutation<unknown, unknown, { id: string; reason: string }>({
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

export function useResumeContract(onSuccess?: (data: unknown) => void, onError?: (err: unknown) => void) {
	return useMutation<unknown, unknown, string>({
		mutationFn: (id: string) => resumeContract(id),
		onSuccess: (data) => onSuccess?.(data),
		onError: (err) => onError?.(err),
	});
}

export async function getPaymentSchedules(contractId: string) {
	return apiGet(API_ROUTES.paymentSchedule.getPaymentSchedules(contractId)) as Promise<Record<string, unknown>[]>;
}

export function useGetPaymentSchedules(contractId: string, enabled = true) {
	return useQuery<Record<string, unknown>[], unknown>({
		queryKey: ["payment-schedules", contractId],
		queryFn: () => getPaymentSchedules(contractId),
		enabled: !!contractId && enabled,
	});
}

export type PaymentLinkResponse = {
	paymentLink: string;
	reference: string;
	amount: number;
	dueDate: string;
	scheduleNumber: number;
	status: string;
	breakdown: {
		principalAmount: number;
		lateFees: number;
		vatAmount: number;
		totalAmount: number;
		systemAmount: number;
	};
};

export async function generatePaymentLink(scheduleId: string) {
	return apiPost<PaymentLinkResponse>(API_ROUTES.paymentSchedule.generatePaymentLink(scheduleId), {}) as Promise<PaymentLinkResponse>;
}

export function useGeneratePaymentLink(onSuccess?: (data: PaymentLinkResponse) => void, onError?: (err: unknown) => void) {
	return useMutation<PaymentLinkResponse, unknown, string>({
		mutationFn: (scheduleId: string) => generatePaymentLink(scheduleId),
		onSuccess: (data) => onSuccess?.(data),
		onError: (err) => onError?.(err),
	});
}

export type CustomerContract = {
	id: string;
	contractCode: string;
	customerId: string;
	propertyId: string;
	paymentTypeId: number;
	statusId: number;
	downPayment: string;
	intervalId: null;
	durationValue: null;
	durationUnitId: null;
	interestRate: null;
	startDate: null;
	endDate: null;
	quantity: number;
	vat: null;
	vatPercentage: string;
	interest: null;
	outStandingBalance: string;
	remarks: string;
	terminatedById: null;
	terminatedAt: null;
	pausedById: string;
	pausedAt: string;
	isPaused: boolean;
	isTerminated: boolean;
	resumedById: string;
	resumedAt: string;
	createdById: string;
	createdAt: string;
	customer: {
		fullName: string;
		email: string;
		phoneNumber: string;
	};
	property: {
		name: string;
		price: string;
		propertyCode: string;
		category: {
			category: string;
			parent: {
				category: string;
			};
		};
	};
	status: {
		status: string;
	};
	paymentType: {
		type: string;
	};
	interval: null;
	durationUnit: null;
	createdBy: {
		fullName: string;
	};
	paymentSchedules: unknown[];
};

export async function getCustomerContracts(customerId: string) {
	return apiGet(API_ROUTES.customer.getCustomerContracts(customerId)) as Promise<ListResponse<CustomerContract>>;
}

export function useGetCustomerContracts(customerId: string, enabled = true) {
	return useQuery<ListResponse<CustomerContract>, unknown>({
		queryKey: ["customer-contracts", customerId],
		queryFn: () => getCustomerContracts(customerId),
		enabled: !!customerId && enabled,
	});
}
