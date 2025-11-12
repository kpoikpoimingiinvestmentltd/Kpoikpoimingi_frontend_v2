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
