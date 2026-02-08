import { apiPost, apiPut } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import type { CustomerRegistrationPayload, CustomerRegistrationResponse } from "@/types/customerRegistration";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiClient";

export async function createInternalCustomerRegistration(payload: CustomerRegistrationPayload) {
	return apiPost<CustomerRegistrationResponse>(API_ROUTES.customerRegistration.createInternalCustomerRegistration, payload);
}

export async function createFullPaymentRegistration(payload: CustomerRegistrationPayload) {
	return apiPost<CustomerRegistrationResponse>(API_ROUTES.customerRegistration.createFullPaymentRegistration, payload);
}

export async function createInternalFullPaymentRegistration(payload: CustomerRegistrationPayload) {
	return apiPost<CustomerRegistrationResponse>(API_ROUTES.customerRegistration.createInternalFullPaymentRegistration, payload);
}

export async function updateCustomerRegistration(id: string, payload: CustomerRegistrationPayload) {
	return apiPut<CustomerRegistrationResponse>(API_ROUTES.customerRegistration.updateCustomerRegistration(id), payload);
}

// Email verification functions
export async function requestEmailVerification(email: string) {
	return apiPost<{ message: string }>(API_ROUTES.customerRegistration.requestEmailVerification, { email });
}

export async function confirmEmailVerification(email: string, otp: string) {
	return apiPost<{ message: string; emailVerificationToken?: string }>(API_ROUTES.customerRegistration.confirmEmailVerification, { email, otp });
}

export function useUpdateCustomerRegistration(onSuccess?: (data: CustomerRegistrationResponse) => void, onError?: (error: unknown) => void) {
	return useMutation<CustomerRegistrationResponse, Error, { id: string; payload: CustomerRegistrationPayload }>({
		mutationFn: ({ id, payload }) => updateCustomerRegistration(id, payload),
		onSuccess,
		onError,
	});
}

export async function getApprovedRegistrations(page = 1, limit = 1000, search?: string, sortBy?: string, sortOrder?: string) {
	const params = new URLSearchParams();
	params.append("page", String(page));
	params.append("limit", String(limit));
	if (search) params.append("search", search);
	if (sortBy) params.append("sortBy", sortBy);
	if (sortOrder) params.append("sortOrder", sortOrder);

	const qs = `?${params.toString()}`;
	const url = `${API_ROUTES.customerRegistration.getApprovedRegistrations}${qs}`;
	return apiGet(url) as Promise<any>;
}

export function useGetApprovedRegistrations(page = 1, limit = 1000, search?: string, sortBy?: string, sortOrder?: string, enabled = true) {
	return useQuery({
		queryKey: ["approved-registrations", page, limit, search, sortBy, sortOrder],
		queryFn: () => getApprovedRegistrations(page, limit, search, sortBy, sortOrder),
		enabled,
	});
}
