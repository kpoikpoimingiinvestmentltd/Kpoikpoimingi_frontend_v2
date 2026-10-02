import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/services/apiClient";
import { API_ROUTES } from "./routes";

export async function sendContractDocument(
	registrationId: string,
	overrideEmail?: string,
) {
	const res = await apiPost(API_ROUTES.contractDocument.send, {
		registrationId,
		...(overrideEmail ? { overrideEmail } : {}),
	});
	return res;
}

export function useSendContractDocument() {
	const qc = useQueryClient();
	return useMutation<any, unknown, { registrationId: string; overrideEmail?: string } | string>({
		mutationFn: (input) => {
			if (typeof input === "string") {
				return sendContractDocument(input);
			}
			return sendContractDocument(input.registrationId, input.overrideEmail);
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["product-requests"] }),
	});
}
