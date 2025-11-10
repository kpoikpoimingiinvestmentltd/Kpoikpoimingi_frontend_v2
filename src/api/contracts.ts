import { useMutation } from "@tanstack/react-query";
import { apiPost } from "@/services/apiClient";
import { API_ROUTES } from "./routes";

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
