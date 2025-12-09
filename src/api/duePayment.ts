import { useQuery, useMutation } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { apiGet, apiGetFile } from "@/services/apiClient";
import { API_ROUTES } from "./routes";

export interface DuePaymentItem {
	id: string;
	paymentScheduleId: string;
	contractId: string;
	customerId: string;
	customerEmail: string;
	customerName: string;
	contractCode: string;
	propertyName: string;
	sentAt: string;
	statusId: number;
	dueDate: string;
	amount: string;
	amountWithVat: string;
	lateFees: string;
	totalDue: string;
	isOverdue: boolean;
	paymentNumber: number;
	status: {
		status: string;
	};
	customer: {
		customerCode: string;
		phoneNumber: string;
	};
	contract: {
		statusId: number;
		startDate: string;
		endDate: string;
		status: {
			status: string;
		};
	};
	paymentSchedule: {
		isPaid: boolean;
		paidAt: string | null;
		paidAmount: string;
		paymentStatus: string | null;
	};
}

export interface DuePaymentResponse {
	data: DuePaymentItem[];
	pagination: {
		page: number;
		limit: number;
		totalCount: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}

export async function getAllDuePayments(
	page = 1,
	limit = 10,
	sortBy?: string,
	sortOrder?: string,
	dueDateFrom?: string,
	dueDateTo?: string,
	dateFrom?: string,
	dateTo?: string,
	contractCode?: string,
	customerName?: string,
	customerEmail?: string,
	isOverdue?: boolean,
	statusId?: number
): Promise<DuePaymentResponse> {
	const params = new URLSearchParams();
	params.append("page", String(page));
	params.append("limit", String(limit));
	if (sortBy) params.append("sortBy", sortBy);
	if (sortOrder) params.append("sortOrder", sortOrder);
	if (dueDateFrom) params.append("dueDateFrom", dueDateFrom);
	if (dueDateTo) params.append("dueDateTo", dueDateTo);
	if (dateFrom) params.append("dateFrom", dateFrom);
	if (dateTo) params.append("dateTo", dateTo);
	if (contractCode) params.append("contractCode", contractCode);
	if (customerName) params.append("customerName", customerName);
	if (customerEmail) params.append("customerEmail", customerEmail);
	if (isOverdue !== undefined) params.append("isOverdue", String(isOverdue));
	if (statusId !== undefined) params.append("statusId", String(statusId));

	const qs = `?${params.toString()}`;
	const url = `${API_ROUTES.duePayment.getAllDuePayments}${qs}`;
	return apiGet(url) as Promise<DuePaymentResponse>;
}

export function useGetAllDuePayments(
	page = 1,
	limit = 10,
	sortBy?: string,
	sortOrder?: string,
	dueDateFrom?: string,
	dueDateTo?: string,
	dateFrom?: string,
	dateTo?: string,
	contractCode?: string,
	customerName?: string,
	customerEmail?: string,
	isOverdue?: boolean,
	statusId?: number,
	enabled = true
): UseQueryResult<DuePaymentResponse, unknown> {
	return useQuery({
		queryKey: [
			"duePayments",
			page,
			limit,
			sortBy,
			sortOrder,
			dueDateFrom,
			dueDateTo,
			dateFrom,
			dateTo,
			contractCode,
			customerName,
			customerEmail,
			isOverdue,
			statusId,
		],
		queryFn: async () =>
			getAllDuePayments(
				page,
				limit,
				sortBy,
				sortOrder,
				dueDateFrom,
				dueDateTo,
				dateFrom,
				dateTo,
				contractCode,
				customerName,
				customerEmail,
				isOverdue,
				statusId
			),
		enabled,
	}) as UseQueryResult<DuePaymentResponse, unknown>;
}

export async function exportDuePayments(
	dueDateFrom?: string,
	dueDateTo?: string,
	dateFrom?: string,
	dateTo?: string,
	contractCode?: string,
	customerName?: string,
	customerEmail?: string,
	isOverdue?: boolean,
	statusId?: number
): Promise<Blob> {
	const params = new URLSearchParams();
	if (dueDateFrom) params.append("dueDateFrom", dueDateFrom);
	if (dueDateTo) params.append("dueDateTo", dueDateTo);
	if (dateFrom) params.append("dateFrom", dateFrom);
	if (dateTo) params.append("dateTo", dateTo);
	if (contractCode) params.append("contractCode", contractCode);
	if (customerName) params.append("customerName", customerName);
	if (customerEmail) params.append("customerEmail", customerEmail);
	if (isOverdue !== undefined) params.append("isOverdue", String(isOverdue));
	if (statusId !== undefined) params.append("statusId", String(statusId));

	const qs = params.toString();
	const url = `${API_ROUTES.duePayment.exportDuePayments}${qs ? `?${qs}` : ""}`;
	return apiGetFile(url) as Promise<Blob>;
}

export function useExportDuePayments() {
	return useMutation<
		Blob,
		unknown,
		{
			dueDateFrom?: string;
			dueDateTo?: string;
			dateFrom?: string;
			dateTo?: string;
			contractCode?: string;
			customerName?: string;
			customerEmail?: string;
			isOverdue?: boolean;
			statusId?: number;
		},
		unknown
	>({
		mutationFn: (payload) =>
			exportDuePayments(
				payload?.dueDateFrom,
				payload?.dueDateTo,
				payload?.dateFrom,
				payload?.dateTo,
				payload?.contractCode,
				payload?.customerName,
				payload?.customerEmail,
				payload?.isOverdue,
				payload?.statusId
			),
	});
}
