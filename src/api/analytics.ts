import { useQuery, useMutation } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { apiGet, apiGetFile } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import type { IncomeAnalytics } from "@/types/analytics";
import type { PenaltiesResponse, VATResponse, IncomeEarnedResponse, VatCollectedResponse, InterestPenaltiesResponse } from "@/types/reports";

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

export function useGetAnalyticsOverview(enabled = true): UseQueryResult<AnalyticsOverview, unknown> {
	return useQuery({
		queryKey: ["analyticsOverview"],
		queryFn: async () => getAnalyticsOverview(),
		enabled,
	}) as UseQueryResult<AnalyticsOverview, unknown>;
}

export async function getIncomeAnalytics() {
	return apiGet(API_ROUTES.analytics.getIncomeAnalytics) as Promise<IncomeAnalytics>;
}

export function useGetIncomeAnalytics(enabled = true): UseQueryResult<IncomeAnalytics, unknown> {
	return useQuery({
		queryKey: ["incomeAnalytics"],
		queryFn: async () => getIncomeAnalytics(),
		enabled,
	}) as UseQueryResult<IncomeAnalytics, unknown>;
}

export async function getRevenueAnalytics() {
	return apiGet(API_ROUTES.analytics.getRevenueAnalytics) as Promise<any>;
}

export function useGetRevenueAnalytics(enabled = true) {
	return useQuery({
		queryKey: ["revenueAnalytics"],
		queryFn: async () => getRevenueAnalytics(),
		enabled,
		staleTime: 5 * 60 * 1000,
	});
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
		staleTime: 5 * 60 * 1000,
	});
}

export async function getAuditLogs(
	page = 1,
	limit = 10,
	search?: string,
	startDate?: string,
	endDate?: string,
	sortBy = "createdAt",
	sortOrder = "desc"
) {
	const params = new URLSearchParams();
	params.append("page", String(page));
	params.append("limit", String(limit));
	if (search) params.append("search", search);
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);
	params.append("sortBy", sortBy);
	params.append("sortOrder", sortOrder);

	const qs = `?${params.toString()}`;
	const url = `${API_ROUTES.auditLogs.getAuditLogs}${qs}`;
	return apiGet(url) as Promise<any>;
}

export function useGetAuditLogs(
	page = 1,
	limit = 10,
	search?: string,
	startDate?: string,
	endDate?: string,
	sortBy = "createdAt",
	sortOrder = "desc",
	enabled = true
) {
	return useQuery({
		queryKey: ["auditLogs", page, limit, search, startDate, endDate, sortBy, sortOrder],
		queryFn: async () => getAuditLogs(page, limit, search, startDate, endDate, sortBy, sortOrder),
		enabled,
		staleTime: 5 * 60 * 1000,
	});
}

export async function exportAuditLogs(startDate?: string, endDate?: string, search?: string) {
	const params = new URLSearchParams();
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);
	if (search) params.append("search", search);

	const qs = params.toString();
	const url = `${API_ROUTES.auditLogs.exportAuditLogs}${qs ? `?${qs}` : ""}`;
	return apiGetFile(url) as Promise<Blob>;
}

export function useExportAuditLogs() {
	return useMutation<Blob, unknown, { startDate?: string; endDate?: string; search?: string }, unknown>({
		mutationFn: (payload) => exportAuditLogs(payload?.startDate, payload?.endDate, payload?.search),
	});
}

export async function getPenalties(page = 1, limit = 10, search?: string, sortBy = "createdAt", sortOrder = "desc"): Promise<PenaltiesResponse> {
	const params = new URLSearchParams();
	params.append("page", String(page));
	params.append("limit", String(limit));
	if (search) params.append("search", search);
	params.append("sortBy", sortBy);
	params.append("sortOrder", sortOrder);

	const qs = `?${params.toString()}`;
	const url = `${API_ROUTES.reports.getPenalties}${qs}`;
	return apiGet<PenaltiesResponse>(url) as Promise<PenaltiesResponse>;
}

export function useGetPenalties(
	page = 1,
	limit = 10,
	search?: string,
	sortBy = "createdAt",
	sortOrder = "desc",
	enabled = true
): UseQueryResult<PenaltiesResponse, unknown> {
	return useQuery({
		queryKey: ["penalties", page, limit, search, sortBy, sortOrder],
		queryFn: async () => getPenalties(page, limit, search, sortBy, sortOrder),
		enabled,
	}) as UseQueryResult<PenaltiesResponse, unknown>;
}

export async function getVATRecords(
	page = 1,
	limit = 10,
	startDate?: string,
	endDate?: string,
	sortBy = "createdAt",
	sortOrder = "desc"
): Promise<VATResponse> {
	const params = new URLSearchParams();
	params.append("page", String(page));
	params.append("limit", String(limit));
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);
	params.append("sortBy", sortBy);
	params.append("sortOrder", sortOrder);

	const qs = `?${params.toString()}`;
	const url = `${API_ROUTES.reports.getVATRecordsList}${qs}`;
	return apiGet<VATResponse>(url) as Promise<VATResponse>;
}

export function useGetVATRecords(
	page = 1,
	limit = 10,
	startDate?: string,
	endDate?: string,
	sortBy = "createdAt",
	sortOrder = "desc",
	enabled = true
): UseQueryResult<VATResponse, unknown> {
	return useQuery({
		queryKey: ["vatRecords", page, limit, startDate, endDate, sortBy, sortOrder],
		queryFn: async () => getVATRecords(page, limit, startDate, endDate, sortBy, sortOrder),
		enabled,
	}) as UseQueryResult<VATResponse, unknown>;
}

export async function getIncomeEarned(period = "daily"): Promise<IncomeEarnedResponse> {
	const url = API_ROUTES.reports.getIncomeEarned(period);
	return apiGet<IncomeEarnedResponse>(url) as Promise<IncomeEarnedResponse>;
}

export function useGetIncomeEarned(period = "daily", enabled = true): UseQueryResult<IncomeEarnedResponse, unknown> {
	return useQuery({
		queryKey: ["incomeEarned", period],
		queryFn: async () => getIncomeEarned(period),
		enabled,
	}) as UseQueryResult<IncomeEarnedResponse, unknown>;
}

export async function getVatCollected(period = "daily"): Promise<VatCollectedResponse> {
	const url = API_ROUTES.reports.getVatCollected(period);
	return apiGet<VatCollectedResponse>(url) as Promise<VatCollectedResponse>;
}

export function useGetVatCollected(period = "daily", enabled = true): UseQueryResult<VatCollectedResponse, unknown> {
	return useQuery({
		queryKey: ["vatCollected", period],
		queryFn: async () => getVatCollected(period),
		enabled,
	}) as UseQueryResult<VatCollectedResponse, unknown>;
}

export async function getInterestPenalties(period = "daily"): Promise<InterestPenaltiesResponse> {
	const url = API_ROUTES.reports.getInterestPenalties(period);
	return apiGet<InterestPenaltiesResponse>(url) as Promise<InterestPenaltiesResponse>;
}

export function useGetInterestPenalties(period = "daily", enabled = true): UseQueryResult<InterestPenaltiesResponse, unknown> {
	return useQuery({
		queryKey: ["interestPenalties", period],
		queryFn: async () => getInterestPenalties(period),
		enabled,
	}) as UseQueryResult<InterestPenaltiesResponse, unknown>;
}

export async function exportInterestPenalties(page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc", period = "daily") {
	const params = new URLSearchParams();
	params.append("page", String(page));
	params.append("limit", String(limit));
	if (search) params.append("search", search);
	params.append("sortBy", sortBy);
	params.append("sortOrder", sortOrder);
	params.append("period", period);
	const query = params.toString();
	const url = `${API_ROUTES.reports.getInterestPenaltiesExport}${query ? `?${query}` : ""}`;
	return apiGetFile(url) as Promise<Blob>;
}

export function useExportInterestPenalties() {
	return useMutation<
		Blob,
		unknown,
		{ page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string; period?: string },
		unknown
	>({
		mutationFn: (payload) =>
			exportInterestPenalties(
				payload?.page || 1,
				payload?.limit || 10,
				payload?.search || "",
				payload?.sortBy || "createdAt",
				payload?.sortOrder || "desc",
				payload?.period || "daily"
			),
	});
}

export async function exportVATRecords(startDate?: string, endDate?: string) {
	const params = new URLSearchParams();
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);
	const query = params.toString();
	const url = `${API_ROUTES.reports.exportVATRecords}${query ? `?${query}` : ""}`;
	return apiGetFile(url) as Promise<Blob>;
}

export function useExportVATRecords() {
	return useMutation<Blob, unknown, { startDate?: string; endDate?: string }, unknown>({
		mutationFn: (payload) => exportVATRecords(payload?.startDate, payload?.endDate),
	});
}
