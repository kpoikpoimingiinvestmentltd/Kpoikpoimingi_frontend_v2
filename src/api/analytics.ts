import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import type { IncomeAnalytics } from "@/types/analytics";

export type AnalyticsOverview = {
	totalPropertyRequests: number;
	unapprovedRequests: number;
	totalPropertiesSold: number;
	totalCustomers: number;
	propertyRequestInfo: {
		approved: number;
		pending: number;
		total: number;
	};
	reportAnalytics: {
		totalIncomeEarned: number;
		totalVATCollected: number;
		totalInterestPenalties: number;
	};
};

export async function getAnalyticsOverview() {
	return apiGet(API_ROUTES.analytics.getAnalyticsOverview) as Promise<AnalyticsOverview>;
}

export function useGetAnalyticsOverview(enabled = true) {
	return useQuery({
		queryKey: ["analyticsOverview"],
		queryFn: async () => getAnalyticsOverview(),
		enabled,
		keepPreviousData: true,
	} as any);
}

export async function getIncomeAnalytics() {
	return apiGet(API_ROUTES.analytics.getIncomeAnalytics) as Promise<IncomeAnalytics>;
}

export function useGetIncomeAnalytics(enabled = true) {
	return useQuery({
		queryKey: ["incomeAnalytics"],
		queryFn: async () => getIncomeAnalytics(),
		enabled,
		keepPreviousData: true,
	} as any);
}

export async function getRevenueAnalytics() {
	return apiGet(API_ROUTES.analytics.getRevenueAnalytics) as Promise<any>;
}

export function useGetRevenueAnalytics(enabled = true) {
	return useQuery({
		queryKey: ["revenueAnalytics"],
		queryFn: async () => getRevenueAnalytics(),
		enabled,
		keepPreviousData: true,
	} as any);
}

export async function getAuditLogsGrouped(page = 1, limit = 10, search?: string, sortBy = "createdAt", sortOrder = "desc") {
	const params = new URLSearchParams();
	params.append("page", String(page));
	params.append("limit", String(limit));
	if (search) params.append("search", search);
	params.append("sortBy", sortBy);
	params.append("sortOrder", sortOrder);

	const qs = `?${params.toString()}`;
	const url = `${API_ROUTES.auditLogs.getAuditLogsGrouped}${qs}`;
	return apiGet(url) as Promise<any>;
}

export function useGetAuditLogsGrouped(page = 1, limit = 10, search?: string, sortBy = "createdAt", sortOrder = "desc", enabled = true) {
	return useQuery({
		queryKey: ["auditLogsGrouped", page, limit, search, sortBy, sortOrder],
		queryFn: async () => getAuditLogsGrouped(page, limit, search, sortBy, sortOrder),
		enabled,
		keepPreviousData: true,
	} as any);
}
