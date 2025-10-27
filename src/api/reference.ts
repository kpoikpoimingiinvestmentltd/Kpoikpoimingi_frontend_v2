import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiClient";
import { API_ROUTES } from "./routes";

export type ReferenceItem = {
	id: string | number;
	type: string;
	key: string;
	value: string;
};

export type ReferenceData = Record<string, ReferenceItem[]>;

export async function getAllReferenceData(refresh = false): Promise<ReferenceData> {
	const url = `${API_ROUTES.reference.getAllReferenceData}${refresh ? "?refresh=true" : ""}`;
	return apiGet(url) as Promise<ReferenceData>;
}

export function useGetReferenceData(enabled = true, refresh = false) {
	return useQuery<ReferenceData>({
		queryKey: ["reference", refresh],
		queryFn: async () => getAllReferenceData(refresh),
		enabled,
		keepPreviousData: true,
	} as any);
}

export default {};
