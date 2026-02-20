import { useQuery, useMutation } from "@tanstack/react-query";
import { apiGet, apiPost, apiDelete, apiGetFile } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import type { GetAllCustomersResponse, Customer, DeleteCustomerResponse } from "@/types/customer";
import type { SendEmailSpecificPayload, SendEmailBroadcastPayload, SendEmailResponse } from "@/types/email";

export async function getAllCustomers(page = 1, limit = 10, search?: string, sortBy?: string, sortOrder?: string) {
	const params = new URLSearchParams();
	params.append("page", String(page));
	params.append("limit", String(limit));
	if (search) params.append("search", search);
	if (sortBy) params.append("sortBy", sortBy);
	if (sortOrder) params.append("sortOrder", sortOrder);

	const qs = `?${params.toString()}`;
	const url = `${API_ROUTES.customer.getAllCustomers}${qs}`;
	return apiGet(url) as Promise<GetAllCustomersResponse>;
}

export function useGetAllCustomers(page = 1, limit = 10, search?: string, sortBy?: string, sortOrder?: string, enabled = true) {
	return useQuery<GetAllCustomersResponse>({
		queryKey: ["customers", page, limit, search, sortBy, sortOrder],
		queryFn: () => getAllCustomers(page, limit, search, sortBy, sortOrder),
		enabled,
	});
}

export async function getCustomerById(customerId: string) {
	return apiGet(API_ROUTES.customer.getCustomerDetails(customerId)) as Promise<Customer>;
}

export function useGetCustomer(customerId?: string, enabled = true) {
	return useQuery<Customer>({
		queryKey: ["customer", customerId],
		queryFn: () => getCustomerById(customerId!),
		enabled: !!customerId && enabled,
	});
}

export async function getCustomerApprovedRegistrations(customerId: string) {
	return apiGet(API_ROUTES.customer.getApprovedRegistrations(customerId)) as Promise<any>;
}

export function useGetCustomerApprovedRegistrations(customerId?: string, enabled = true) {
	return useQuery({
		queryKey: ["customer-approved-registrations", customerId],
		queryFn: () => getCustomerApprovedRegistrations(customerId!),
		enabled: !!customerId && enabled,
	});
}

export async function getCustomerContracts(customerId: string) {
	return apiGet(API_ROUTES.customer.getCustomerContracts(customerId)) as Promise<any>;
}

export function useGetCustomerContracts(customerId?: string, enabled = true) {
	return useQuery({
		queryKey: ["customer-contracts", customerId],
		queryFn: () => getCustomerContracts(customerId!),
		enabled: !!customerId && enabled,
	});
}

export async function getCustomerPayments(customerId: string) {
	return apiGet(API_ROUTES.customer.getCustomerPayments(customerId)) as Promise<any>;
}

export function useGetCustomerPayments(customerId?: string, enabled = true) {
	return useQuery({
		queryKey: ["customer-payments", customerId],
		queryFn: () => getCustomerPayments(customerId!),
		enabled: !!customerId && enabled,
	});
}

export async function getCustomerDocuments(customerId: string) {
	return apiGet(API_ROUTES.customer.getCustomerDocuments(customerId)) as Promise<any>;
}

export function useGetCustomerDocuments(customerId?: string, enabled = true) {
	return useQuery({
		queryKey: ["customer-documents", customerId],
		queryFn: () => getCustomerDocuments(customerId!),
		enabled: !!customerId && enabled,
	});
}

export async function getCustomerReceipts(customerId: string) {
	return apiGet(API_ROUTES.customer.getCustomerReceipts(customerId)) as Promise<any>;
}

export function useGetCustomerReceipts(customerId?: string, enabled = true) {
	return useQuery({
		queryKey: ["customer-receipts", customerId],
		queryFn: () => getCustomerReceipts(customerId!),
		enabled: !!customerId && enabled,
	});
}

export async function sendEmailToSpecificCustomers(payload: SendEmailSpecificPayload) {
	return apiPost<SendEmailResponse>(API_ROUTES.customer.sendEmailSpecific, payload) as Promise<SendEmailResponse>;
}

export function useSendEmailToSpecificCustomers(onSuccess?: (data: SendEmailResponse) => void, onError?: (error: unknown) => void) {
	return useMutation<SendEmailResponse, Error, SendEmailSpecificPayload>({
		mutationFn: (payload: SendEmailSpecificPayload) => sendEmailToSpecificCustomers(payload),
		onSuccess,
		onError,
	});
}

export async function sendEmailBroadcast(payload: SendEmailBroadcastPayload) {
	return apiPost<SendEmailResponse>(API_ROUTES.customer.sendEmailBroadcast, payload) as Promise<SendEmailResponse>;
}

export function useSendEmailBroadcast(onSuccess?: (data: SendEmailResponse) => void, onError?: (error: unknown) => void) {
	return useMutation<SendEmailResponse, Error, SendEmailBroadcastPayload>({
		mutationFn: (payload: SendEmailBroadcastPayload) => sendEmailBroadcast(payload),
		onSuccess,
		onError,
	});
}

export async function deleteCustomer(customerId: string) {
	return apiDelete<DeleteCustomerResponse>(API_ROUTES.customer.deleteCustomer(customerId)) as Promise<DeleteCustomerResponse>;
}

export function useDeleteCustomer(onSuccess?: (data: DeleteCustomerResponse) => void, onError?: (error: unknown) => void) {
	return useMutation<DeleteCustomerResponse, Error, string>({
		mutationFn: (customerId: string) => deleteCustomer(customerId),
		onSuccess,
		onError,
	});
}

export async function exportCustomersAsCSV(search?: string) {
	const params = new URLSearchParams();
	if (search) params.append("search", search);

	const qs = params.toString();
	const url = `${API_ROUTES.customer.exportCustomers}${qs ? `?${qs}` : ""}`;
	return apiGetFile(url) as Promise<Blob>;
}

export function useExportCustomersAsCSV() {
	return useMutation<Blob, unknown, { search?: string }, unknown>({
		mutationFn: (payload) => exportCustomersAsCSV(payload?.search),
	});
}

export async function getCustomersWithActiveContract(page = 1, limit = 10, search?: string, sortBy?: string, sortOrder?: string) {
	const params = new URLSearchParams();
	params.append("page", String(page));
	params.append("limit", String(limit));
	if (search) params.append("search", search);
	if (sortBy) params.append("sortBy", sortBy);
	if (sortOrder) params.append("sortOrder", sortOrder);

	const qs = `?${params.toString()}`;
	const url = `${API_ROUTES.customer.getCustomersWithActiveContract}${qs}`;
	return apiGet(url) as Promise<GetAllCustomersResponse>;
}

export function useGetCustomersWithActiveContract(page = 1, limit = 10, search?: string, sortBy?: string, sortOrder?: string, enabled = true) {
	return useQuery<GetAllCustomersResponse>({
		queryKey: ["customers-with-active-contract", page, limit, search, sortBy, sortOrder],
		queryFn: () => getCustomersWithActiveContract(page, limit, search, sortBy, sortOrder),
		enabled,
	});
}
