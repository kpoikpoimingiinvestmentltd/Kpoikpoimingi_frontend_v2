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
	return apiGet(url) as Promise<PaginatedResult<unknown>>;
}

export type CategorySubInput = string | { id?: string; name: string };

function normalizeSubcategories(subcategories?: CategorySubInput[]) {
	if (!Array.isArray(subcategories)) return undefined;
	return subcategories
		.map((sub) => {
			if (typeof sub === "string") return { name: sub.trim() };
			return {
				...(sub.id ? { id: sub.id } : {}),
				name: String(sub.name ?? "").trim(),
			};
		})
		.filter((sub) => Boolean(sub.name));
}

export async function createCategory(payload: {
	category?: string;
	description?: string;
	parentId?: string | null;
	subcategories?: CategorySubInput[];
}) {
	const body: Record<string, unknown> = {
		category: payload.category,
		description: payload.description,
	};
	const subs = normalizeSubcategories(payload.subcategories);
	if (subs) body.subcategories = subs;
	if (payload.parentId) body.parentId = payload.parentId;
	return apiPost(API_ROUTES.propertyCategories.createCategory, body) as Promise<unknown>;
}

export async function updateCategory(
	id: string,
	payload: { category?: string; description?: string; subcategories?: CategorySubInput[] },
) {
	const body: Record<string, unknown> = {
		category: payload.category,
		description: payload.description,
	};
	const subs = normalizeSubcategories(payload.subcategories);
	if (subs) body.subcategories = subs;
	return apiPatch(API_ROUTES.propertyCategories.updateCategory(id), body) as Promise<unknown>;
}

export function useGetAllCategories(page = 1, limit = 10, enabled = true) {
	return useQuery({ queryKey: ["categories", page, limit], queryFn: () => getAllCategories(page, limit), enabled });
}

export default { getAllCategories, createCategory, updateCategory };

export async function deleteCategory(id: string) {
	return apiDelete(API_ROUTES.propertyCategories.deleteCategory(id)) as Promise<unknown>;
}
