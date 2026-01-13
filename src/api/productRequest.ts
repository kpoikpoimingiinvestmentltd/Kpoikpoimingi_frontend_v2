import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete, apiGetFile } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import type {
	ProductRequestResponse,
	ApproveRegistrationResponse,
	DeclineRegistrationResponse,
	DeleteRegistrationResponse,
} from "@/types/productRequest";

export async function getProductRequests(page = 1, limit = 10, search = "", sortBy?: string, sortOrder?: string) {
	const params = new URLSearchParams();
	params.append("page", String(page));
	params.append("limit", String(limit));
	if (search) params.append("search", String(search));
	if (sortBy) params.append("sortBy", String(sortBy));
	if (sortOrder) params.append("sortOrder", String(sortOrder));
	const res = await apiGet(`${API_ROUTES.customerRegistration.getExternalCustomerRegistrations}?${params.toString()}`);
	return res as ProductRequestResponse;
}

export function useGetProductRequests(page = 1, limit = 10, search = "", sortBy?: string, sortOrder?: string, enabled = true) {
	return useQuery<ProductRequestResponse, unknown>({
		queryKey: ["product-requests", page, limit, search, sortBy, sortOrder],
		queryFn: () => getProductRequests(page, limit, search, sortBy, sortOrder),
		enabled,
	});
}

export async function getProductRequestById(registrationId: string) {
	const res = await apiGet(API_ROUTES.customerRegistration.getCustomerRegistrationById(registrationId));
	return res;
}

export function useGetProductRequestById(registrationId: string, enabled = true) {
	return useQuery({
		queryKey: ["product-request", registrationId],
		queryFn: () => getProductRequestById(registrationId),
		enabled,
	});
}

export async function approveRegistration(registrationId: string) {
	const res = await apiPost<ApproveRegistrationResponse>(API_ROUTES.customerRegistration.approveCustomerRegistration(registrationId), {});
	return res as ApproveRegistrationResponse;
}

export async function declineRegistration(id: string) {
	const res = await apiPut<DeclineRegistrationResponse>(API_ROUTES.customerRegistration.declineCustomerRegistration(id), {});
	return res as DeclineRegistrationResponse;
}

export async function deleteRegistration(id: string) {
	const res = await apiDelete<DeleteRegistrationResponse>(API_ROUTES.customerRegistration.getCustomerRegistrationById(id));
	return res as DeleteRegistrationResponse;
}

export function useApproveRegistration() {
	const qc = useQueryClient();
	return useMutation<ApproveRegistrationResponse, unknown, string>({
		mutationFn: (id: string) => approveRegistration(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["product-requests"] }),
	});
}

export function useDeclineRegistration() {
	const qc = useQueryClient();
	return useMutation<DeclineRegistrationResponse, unknown, string>({
		mutationFn: (id: string) => declineRegistration(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["product-requests"] }),
	});
}

export function useDeleteRegistration() {
	const qc = useQueryClient();
	return useMutation<DeleteRegistrationResponse, unknown, string>({
		mutationFn: (id: string) => deleteRegistration(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["product-requests"] }),
	});
}

export async function exportProductRequests(search?: string) {
	const params = new URLSearchParams();
	if (search) params.append("search", search);
	const query = params.toString();
	const url = `${API_ROUTES.customerRegistration.exportCustomerRegistrations}${query ? `?${query}` : ""}`;
	return apiGetFile(url) as Promise<Blob>;
}

export function useExportProductRequests() {
	return useMutation<Blob, unknown, { search?: string }, unknown>({
		mutationFn: (payload) => exportProductRequests(payload?.search),
	});
}
