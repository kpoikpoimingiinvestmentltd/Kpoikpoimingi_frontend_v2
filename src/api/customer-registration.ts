import { apiPost, apiPut } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import type { CustomerRegistrationPayload, CustomerRegistrationResponse } from "@/types/customerRegistration";
import { useMutation } from "@tanstack/react-query";

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
