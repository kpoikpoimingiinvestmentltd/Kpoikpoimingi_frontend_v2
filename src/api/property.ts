import { useMutation, useQuery } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import type { PropertyFormData, PropertyPayload, PropertyResponse, PropertyData } from "@/types/property";

export type { PropertyFormData, PropertyPayload, PropertyResponse, PropertyData };

// Create Property
export async function createPropertyRequest(payload: PropertyPayload) {
	return apiPost(API_ROUTES.property.createProperty, payload);
}

export function useCreateProperty(onSuccess?: (data: PropertyResponse) => void, onError?: (error: unknown) => void) {
	return useMutation({
		mutationFn: async (payload: PropertyPayload) => {
			const data = await createPropertyRequest(payload);
			return data as PropertyResponse;
		},
		onSuccess: (data) => onSuccess?.(data),
		onError: (error) => onError?.(error),
	});
}

// Get All Properties
export async function getAllProperties(page?: number, limit?: number, search?: string, sortBy?: string, sortOrder?: string) {
	const qs = new URLSearchParams();
	if (typeof page === "number") qs.append("page", String(page));
	if (typeof limit === "number") qs.append("limit", String(limit));
	if (search) qs.append("search", search);
	if (sortBy) qs.append("sortBy", sortBy);
	if (sortOrder) qs.append("sortOrder", sortOrder);

	const url = `${API_ROUTES.property.getAllProperties}${qs.toString() ? `?${qs.toString()}` : ""}`;
	return apiGet(url);
}

export function useGetAllProperties(page = 1, limit = 10, search?: string, sortBy?: string, sortOrder?: string, enabled = true) {
	return useQuery({
		queryKey: ["properties", page, limit, search || "", sortBy || "", sortOrder || ""],
		queryFn: async () => getAllProperties(page, limit, search, sortBy, sortOrder),
		enabled,
		staleTime: 5 * 60 * 1000,
	});
}

// Get Property by ID
export async function getPropertyById(id: string) {
	return apiGet(API_ROUTES.property.getPropertyById(id));
}

export function useGetPropertyById(id?: string) {
	return useQuery({
		queryKey: ["property", id],
		queryFn: async () => getPropertyById(id!),
		enabled: !!id,
	});
}

// Update Property
export async function updatePropertyRequest(id: string, payload: Partial<PropertyPayload>) {
	return apiPut(API_ROUTES.property.updateProperty(id), payload);
}

export function useUpdateProperty(onSuccess?: (data: unknown) => void, onError?: (error: unknown) => void) {
	return useMutation({
		mutationFn: async ({ id, payload }: { id: string; payload: Partial<PropertyPayload> }) => {
			const data = await updatePropertyRequest(id, payload);
			return data;
		},
		onSuccess: (data) => onSuccess?.(data),
		onError: (error) => onError?.(error),
	});
}

// Delete Property
export async function deletePropertyRequest(id: string) {
	return apiDelete(API_ROUTES.property.deleteProperty(id));
}

export function useDeleteProperty(onSuccess?: (data: unknown) => void, onError?: (error: unknown) => void) {
	return useMutation({
		mutationFn: async (id: string) => {
			const data = await deletePropertyRequest(id);
			return data;
		},
		onSuccess: (data) => onSuccess?.(data),
		onError: (error) => onError?.(error),
	});
}
