import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/services/apiClient";
import { API_ROUTES } from "./routes";

export type OutrightSalePropertyItem = {
	propertyId: string;
	quantity?: number;
	salePrice?: number;
};

export type CreateOutrightSalePayload = {
	items: OutrightSalePropertyItem[];
	paymentMethodId: number;
	generatePaymentLink?: boolean;
	customerName: string;
	customerEmail?: string;
	customerPhone?: string;
};

export type OutrightSaleProperty = {
	id: string;
	name: string;
	propertyCode?: string;
	price: string | number;
	description?: string | null;
	condition?: string | null;
	media?: string[];
	vehicleMake?: string | null;
	vehicleModel?: string | null;
	vehicleYear?: number | null;
	vehicleColor?: string | null;
	vehicleType?: string | null;
	vehicleRegistrationNumber?: string | null;
	category?: { id: string; category: string; isVehicle?: boolean } | null;
	status?: { id: number; status: string } | null;
};

export type OutrightSaleItem = {
	id: string;
	propertyId: string;
	quantity: number;
	salePrice: string | number;
	property?: OutrightSaleProperty;
};

export type OutrightSaleResponse = {
	id: string;
	salePrice: string | number;
	salePriceWithVat: string | number;
	paymentLink?: string | null;
	paymentReference?: string | null;
	paidAt?: string | null;
	createdAt?: string;
	customerName: string;
	customerEmail?: string | null;
	customerPhone?: string | null;
	paymentMethod?: { id: number; method: string };
	receipt?: {
		id: string;
		receiptNumber?: string;
		paymentDate?: string;
		statusId?: number;
	} | null;
	items?: OutrightSaleItem[];
};

export type OutrightSaleListResponse = {
	data: OutrightSaleResponse[];
	pagination?: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext?: boolean;
		hasPrev?: boolean;
	};
};

export async function createOutrightSale(payload: CreateOutrightSalePayload) {
	return apiPost(API_ROUTES.outrightSale.create, payload) as Promise<OutrightSaleResponse>;
}

export async function getOutrightSales(page = 1, limit = 10, search = "") {
	const params = new URLSearchParams();
	params.set("page", String(page));
	params.set("limit", String(limit));
	if (search.trim()) params.set("search", search.trim());
	return apiGet(`${API_ROUTES.outrightSale.list}?${params.toString()}`) as Promise<OutrightSaleListResponse>;
}

function unwrapSale(raw: unknown): OutrightSaleResponse {
	if (!raw || typeof raw !== "object") {
		return raw as OutrightSaleResponse;
	}
	const obj = raw as Record<string, unknown>;
	if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
		return obj.data as OutrightSaleResponse;
	}
	return raw as OutrightSaleResponse;
}

export async function getOutrightSaleById(id: string) {
	const raw = await apiGet(API_ROUTES.outrightSale.byId(id));
	return unwrapSale(raw);
}

export function useGetOutrightSales(page = 1, limit = 10, search = "", enabled = true) {
	return useQuery({
		queryKey: ["outright-sales", page, limit, search],
		queryFn: () => getOutrightSales(page, limit, search),
		enabled,
		staleTime: 60_000,
		refetchOnWindowFocus: false,
		placeholderData: (prev) => prev,
	});
}

export function useGetOutrightSaleById(id?: string) {
	return useQuery({
		queryKey: ["outright-sale", id],
		queryFn: () => getOutrightSaleById(id as string),
		enabled: Boolean(id),
		staleTime: 60_000,
		refetchOnWindowFocus: false,
	});
}

export function useCreateOutrightSale(
	onSuccess?: (data: OutrightSaleResponse) => void,
	onError?: (error: unknown) => void,
) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: createOutrightSale,
		onSuccess: (data) => {
			qc.invalidateQueries({ queryKey: ["properties"] });
			qc.invalidateQueries({ queryKey: ["property"] });
			qc.invalidateQueries({ queryKey: ["outright-sales"] });
			onSuccess?.(data);
		},
		onError,
	});
}
