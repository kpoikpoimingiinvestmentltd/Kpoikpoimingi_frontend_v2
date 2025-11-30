import { useMutation, useQuery } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import type { PropertyFormData, PropertyPayload, PropertyResponse, PropertyData } from "@/types/property";

export type { PropertyFormData, PropertyPayload, PropertyResponse, PropertyData };

// Create Property
export async function createPropertyRequest(payload: PropertyPayload) {
	return apiPost(API_ROUTES.property.createProperty, payload);
}

export function useCreateProperty(onSuccess?: (data: PropertyResponse) => void, onError?: (error: any) => void) {
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
export async function getAllProperties() {
	return apiGet(API_ROUTES.property.getAllProperties);
}

export function useGetAllProperties(enabled = true) {
	return useQuery({
		queryKey: ["properties"],
		queryFn: async () => getAllProperties(),
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

export function useUpdateProperty(onSuccess?: (data: any) => void, onError?: (error: any) => void) {
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

export function useDeleteProperty(onSuccess?: (data: any) => void, onError?: (error: any) => void) {
	return useMutation({
		mutationFn: async (id: string) => {
			const data = await deletePropertyRequest(id);
			return data;
		},
		onSuccess: (data) => onSuccess?.(data),
		onError: (error) => onError?.(error),
	});
}
