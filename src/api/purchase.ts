import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch, apiPost } from "@/services/apiClient";
import { API_ROUTES } from "./routes";

export type Supplier = {
	id: string;
	name: string;
	phone?: string | null;
	email?: string | null;
	address?: string | null;
	notes?: string | null;
};

export type PurchasePropertyPayload = {
	name: string;
	categoryId: string;
	description: string;
	price: string | number;
	quantityTotal: number;
	isPublic?: boolean;
	condition?: string;
	mediaKeys?: Record<string, string>;
	purchasePrice: string | number;
	allocatedTransportation?: string | number;
	allocatedMiscellaneous?: string | number;
	pricingMethod?: "MANUAL" | "COST_PLUS_MARKUP";
	markupPercentage?: string | number;
	vehicleMake?: string;
	vehicleModel?: string;
	vehicleYear?: number;
	vehicleColor?: string;
	vehicleChassisNumber?: string;
	vehicleType?: string;
	vehicleRegistrationNumber?: string;
	propertyRequestId?: string;
};

export async function getSuppliers(page = 1, limit = 100, search?: string) {
	const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
	if (search) qs.append("search", search);
	return apiGet(`${API_ROUTES.purchase.suppliers}?${qs.toString()}`);
}

export function useGetSuppliers(page = 1, limit = 100, search?: string) {
	return useQuery({
		queryKey: ["suppliers", page, limit, search || ""],
		queryFn: () => getSuppliers(page, limit, search),
		staleTime: 60_000,
	});
}

export async function createSupplier(payload: { name: string; phone?: string; email?: string; address?: string; notes?: string }) {
	return apiPost(API_ROUTES.purchase.suppliers, payload);
}

export function useCreateSupplier(onSuccess?: (data: unknown) => void, onError?: (error: unknown) => void) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: createSupplier,
		onSuccess: (data) => {
			qc.invalidateQueries({ queryKey: ["suppliers"] });
			onSuccess?.(data);
		},
		onError,
	});
}

export async function createIndividualPurchase(payload: {
	property: PurchasePropertyPayload;
	supplierId: string;
	purchaseDate: string;
	transportation: string | number;
	miscellaneous: string | number;
	notes?: string;
}) {
	return apiPost(API_ROUTES.purchase.individual, payload);
}

export async function createBatchPurchase(payload: {
	supplierId: string;
	purchaseDate: string;
	notes?: string;
	transportationCost: string | number;
	miscellaneousCost: string | number;
	allocationMethod: "EQUAL" | "PURCHASE_PRICE_WEIGHTED" | "MANUAL";
	properties: PurchasePropertyPayload[];
}) {
	return apiPost(API_ROUTES.purchase.batch, payload);
}

export async function addPropertyToBatch(
	batchId: string,
	payload: {
		property: PurchasePropertyPayload;
		notes?: string;
		manualAllocations?: Array<{
			purchaseId?: string;
			isNew?: boolean;
			allocatedTransportation: string | number;
			allocatedMiscellaneous: string | number;
		}>;
	},
) {
	return apiPost(API_ROUTES.purchase.addToBatch(batchId), payload);
}

export function useCreateIndividualPurchase(onSuccess?: (data: unknown) => void, onError?: (error: unknown) => void) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: createIndividualPurchase,
		onSuccess: (data) => {
			qc.invalidateQueries({ queryKey: ["properties"] });
			qc.invalidateQueries({ queryKey: ["purchases"] });
			qc.invalidateQueries({ queryKey: ["purchase-batches"] });
			onSuccess?.(data);
		},
		onError,
	});
}

export function useCreateBatchPurchase(onSuccess?: (data: unknown) => void, onError?: (error: unknown) => void) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: createBatchPurchase,
		onSuccess: (data) => {
			qc.invalidateQueries({ queryKey: ["properties"] });
			qc.invalidateQueries({ queryKey: ["purchases"] });
			qc.invalidateQueries({ queryKey: ["purchase-batches"] });
			onSuccess?.(data);
		},
		onError,
	});
}

export function useAddPropertyToBatch(onSuccess?: (data: unknown) => void, onError?: (error: unknown) => void) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ batchId, payload }: { batchId: string; payload: Parameters<typeof addPropertyToBatch>[1] }) =>
			addPropertyToBatch(batchId, payload),
		onSuccess: (data) => {
			qc.invalidateQueries({ queryKey: ["properties"] });
			qc.invalidateQueries({ queryKey: ["purchases"] });
			qc.invalidateQueries({ queryKey: ["purchase-batches"] });
			onSuccess?.(data);
		},
		onError,
	});
}

export async function getPurchaseBatches(page = 1, limit = 10, search?: string) {
	const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
	if (search) qs.append("search", search);
	return apiGet(`${API_ROUTES.purchase.batches}?${qs.toString()}`);
}

export function useGetPurchaseBatches(page = 1, limit = 10, search?: string) {
	return useQuery({
		queryKey: ["purchase-batches", page, limit, search || ""],
		queryFn: () => getPurchaseBatches(page, limit, search),
		staleTime: 30_000,
	});
}

export async function getPurchaseBatchById(id: string) {
	return apiGet(API_ROUTES.purchase.batchById(id));
}

export function useGetPurchaseBatchById(id?: string) {
	return useQuery({
		queryKey: ["purchase-batch", id],
		queryFn: () => getPurchaseBatchById(id!),
		enabled: !!id,
	});
}

export async function getPurchaseByPropertyId(propertyId: string) {
	return apiGet(API_ROUTES.purchase.byProperty(propertyId));
}

export function useGetPurchaseByPropertyId(propertyId?: string) {
	return useQuery({
		queryKey: ["purchase-by-property", propertyId],
		queryFn: async () => {
			const data = await getPurchaseByPropertyId(propertyId!);
			// API returns null/empty when the property has no purchase record
			if (data == null || data === "") return null;
			return data as PurchaseRecord;
		},
		enabled: !!propertyId,
		staleTime: 30_000,
		retry: 1,
	});
}

export type PurchaseRecord = {
	id: string;
	reference: string;
	batchId?: string | null;
	propertyId: string;
	purchaseDate: string;
	purchasePrice: string | number;
	quantity: number;
	allocatedTransportation: string | number;
	allocatedMiscellaneous: string | number;
	totalAcquisitionCost: string | number;
	notes?: string | null;
	supplier?: Supplier | null;
	batch?: {
		id: string;
		reference: string;
		allocationMethod?: string;
		transportationCost?: string | number;
		miscellaneousCost?: string | number;
		purchaseDate?: string;
		notes?: string | null;
		status?: string;
	} | null;
	property?: {
		id: string;
		propertyCode?: string;
		name?: string;
		price?: string | number;
		quantityTotal?: number;
		quantityAssigned?: number;
		pricingMethod?: string | null;
		markupPercentage?: string | number | null;
	};
};

export type UpdateIndividualPurchasePayload = {
	supplierId?: string;
	purchaseDate?: string;
	purchasePrice?: string | number;
	quantity?: number;
	transportation?: string | number;
	miscellaneous?: string | number;
	notes?: string;
};

export type UpdateBatchPurchasePayload = {
	supplierId?: string;
	purchaseDate?: string;
	transportationCost?: string | number;
	miscellaneousCost?: string | number;
	allocationMethod?: "EQUAL" | "PURCHASE_PRICE_WEIGHTED" | "MANUAL";
	notes?: string;
	lines?: Array<{
		purchaseId: string;
		purchasePrice?: string | number;
		quantity?: number;
		allocatedTransportation?: string | number;
		allocatedMiscellaneous?: string | number;
	}>;
};

export type BatchPreviewResponse = {
	batchId: string;
	reference: string;
	propertyCount: number;
	warning: string;
	nextBatch: {
		transportationCost: string;
		miscellaneousCost: string;
		allocationMethod: string;
	};
	lines: Array<{
		purchaseId: string;
		reference: string;
		propertyId: string;
		propertyCode?: string;
		propertyName?: string;
		purchasePrice: string;
		quantity: number;
		previous: {
			allocatedTransportation: string;
			allocatedMiscellaneous: string;
			totalAcquisitionCost: string;
		};
		next: {
			allocatedTransportation: string;
			allocatedMiscellaneous: string;
			totalAcquisitionCost: string;
		};
	}>;
};

export async function updateIndividualPurchase(id: string, payload: UpdateIndividualPurchasePayload) {
	return apiPatch(API_ROUTES.purchase.update(id), payload);
}

export async function previewBatchUpdate(batchId: string, payload: UpdateBatchPurchasePayload) {
	return apiPost(API_ROUTES.purchase.previewBatch(batchId), payload);
}

export async function updateBatchPurchase(batchId: string, payload: UpdateBatchPurchasePayload) {
	return apiPatch(API_ROUTES.purchase.updateBatch(batchId), payload);
}

function invalidatePurchaseQueries(qc: ReturnType<typeof useQueryClient>) {
	qc.invalidateQueries({ queryKey: ["properties"] });
	qc.invalidateQueries({ queryKey: ["purchases"] });
	qc.invalidateQueries({ queryKey: ["purchase-batches"] });
	qc.invalidateQueries({ queryKey: ["purchase-batch"] });
	qc.invalidateQueries({ queryKey: ["purchase-by-property"] });
}

export function useUpdateIndividualPurchase(onSuccess?: (data: unknown) => void, onError?: (error: unknown) => void) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateIndividualPurchasePayload }) =>
			updateIndividualPurchase(id, payload),
		onSuccess: (data) => {
			invalidatePurchaseQueries(qc);
			onSuccess?.(data);
		},
		onError,
	});
}

export function usePreviewBatchUpdate() {
	return useMutation({
		mutationFn: ({ batchId, payload }: { batchId: string; payload: UpdateBatchPurchasePayload }) =>
			previewBatchUpdate(batchId, payload),
	});
}

export function useUpdateBatchPurchase(onSuccess?: (data: unknown) => void, onError?: (error: unknown) => void) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ batchId, payload }: { batchId: string; payload: UpdateBatchPurchasePayload }) =>
			updateBatchPurchase(batchId, payload),
		onSuccess: (data) => {
			invalidatePurchaseQueries(qc);
			onSuccess?.(data);
		},
		onError,
	});
}
