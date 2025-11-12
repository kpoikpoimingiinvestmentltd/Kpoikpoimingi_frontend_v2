import { apiPost } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import type { CustomerRegistrationPayload, CustomerRegistrationResponse } from "@/types/customerRegistration";

export async function createInternalCustomerRegistration(payload: CustomerRegistrationPayload) {
	return apiPost<CustomerRegistrationResponse>(API_ROUTES.customerRegistration.createInternalCustomerRegistration, payload);
}

export async function createFullPaymentRegistration(payload: CustomerRegistrationPayload) {
	return apiPost<CustomerRegistrationResponse>(API_ROUTES.customerRegistration.createFullPaymentRegistration, payload);
}

export async function createInternalFullPaymentRegistration(payload: CustomerRegistrationPayload) {
	return apiPost<CustomerRegistrationResponse>(API_ROUTES.customerRegistration.createInternalFullPaymentRegistration, payload);
}
