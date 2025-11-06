import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import type { GetAllCustomersResponse, Customer } from "@/types/customer";

export async function getAllCustomers(page = 1, limit = 10, search?: string, sortBy?: string, sortOrder?: string) {
	const params = new URLSearchParams();
	params.append("page", String(page));
	params.append("limit", String(limit));
	if (search) params.append("search", search);
	if (sortBy) params.append("sortBy", sortBy);
	if (sortOrder) params.append("sortOrder", sortOrder);

	const qs = `?${params.toString()}`;
	const url = `${API_ROUTES.customer.getAllCustomers}${qs}`;
	return apiGet(url) as Promise<GetAllCustomersResponse>;
}

export function useGetAllCustomers(page = 1, limit = 10, search?: string, sortBy?: string, sortOrder?: string, enabled = true) {
	return useQuery({
		queryKey: ["customers", page, limit, search, sortBy, sortOrder],
		queryFn: () => getAllCustomers(page, limit, search, sortBy, sortOrder),
		enabled,
		keepPreviousData: true,
	} as any);
}

export async function getCustomerById(customerId: string) {
	return apiGet(API_ROUTES.customer.getCustomerDetails(customerId)) as Promise<Customer>;
}

export function useGetCustomer(customerId?: string, enabled = true) {
	return useQuery({
		queryKey: ["customer", customerId],
		queryFn: () => getCustomerById(customerId!),
		enabled: !!customerId && enabled,
	} as any);
}
