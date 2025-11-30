import { useQuery } from "@tanstack/react-query";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/services/apiClient";
import { API_ROUTES } from "./routes";

export type PaginatedResult<T> = {
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
	data: T[];
};

export async function getAllCategories(page = 1, limit = 10) {
	const qs = `?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`;
	const url = `${API_ROUTES.propertyCategories.getAllCategories}${qs}`;
	return apiGet(url) as Promise<PaginatedResult<any>>;
}

export async function createCategory(payload: { category?: string; description?: string; parentId?: string | null; subcategories?: string[] }) {
	const body: any = {
		category: payload.category,
		description: payload.description,
	};
	if (payload.subcategories && Array.isArray(payload.subcategories)) {
		body.subcategories = payload.subcategories.map((name) => ({ name }));
	}
	if (payload.parentId) body.parentId = payload.parentId;
	return apiPost(API_ROUTES.propertyCategories.createCategory, body) as Promise<any>;
}

export async function updateCategory(id: string, payload: { category?: string; description?: string; subcategories?: string[] }) {
	const body: any = {
		category: payload.category,
		description: payload.description,
	};
	if (payload.subcategories && Array.isArray(payload.subcategories)) {
		body.subcategories = payload.subcategories.map((name) => ({ name }));
	}
	return apiPatch(API_ROUTES.propertyCategories.updateCategory(id), body) as Promise<any>;
}

export function useGetAllCategories(page = 1, limit = 10, enabled = true) {
	return useQuery({ queryKey: ["categories", page, limit], queryFn: () => getAllCategories(page, limit), enabled });
}

export default { getAllCategories, createCategory, updateCategory };

export async function deleteCategory(id: string) {
	return apiDelete(API_ROUTES.propertyCategories.deleteCategory(id)) as Promise<any>;
}
