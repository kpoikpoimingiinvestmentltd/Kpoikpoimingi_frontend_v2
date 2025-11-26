import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/services/apiClient";
import { API_ROUTES } from "./routes";

export async function sendContractDocument(registrationId: string) {
	const res = await apiPost(API_ROUTES.contractDocument.send, { registrationId });
	return res;
}

export function useSendContractDocument() {
	const qc = useQueryClient();
	return useMutation<any, unknown, string>({
		mutationFn: (id: string) => sendContractDocument(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["product-requests"] }),
	});
}
