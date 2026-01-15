import { useMutation, useQuery } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/services/apiClient";
import { API_ROUTES } from "./routes";
import type { GenerateReceiptPayload } from "@/types/receipt";

export async function getReceipts(page = 1, limit = 10, search?: string, sortBy = "createdAt", sortOrder = "desc") {
	const params = new URLSearchParams();
	params.append("page", String(page));
	params.append("limit", String(limit));
	if (search) params.append("search", search);
	if (sortBy) params.append("sortBy", sortBy);
	if (sortOrder) params.append("sortOrder", sortOrder);
	const url = `${API_ROUTES.receipt.getAllReceipts}?${params.toString()}`;
	return apiGet(url) as Promise<any>;
}

export function useGetReceipts(page = 1, limit = 10, search?: string, sortBy = "createdAt", sortOrder = "desc", enabled = true) {
	return useQuery({
		queryKey: ["receipts", page, limit, search, sortBy, sortOrder],
		queryFn: () => getReceipts(page, limit, search, sortBy, sortOrder),
		enabled: !!enabled,
	});
}

export async function getReceiptById(id: string) {
	const url = API_ROUTES.receipt.getReceiptsById(id);
	return apiGet(url) as Promise<any>;
}

export function useGetReceiptById(id?: string, enabled = true) {
	return useQuery({
		queryKey: ["receipt", id],
		queryFn: () => getReceiptById(id!),
		enabled: !!id && enabled,
	});
}

export async function generateReceipt(payload: GenerateReceiptPayload) {
	const url = API_ROUTES.receipt.generateReceipt;
	return apiPost(url, payload) as Promise<any>;
}

export function useGenerateReceipt() {
	return useMutation({
		mutationFn: (payload: GenerateReceiptPayload) => generateReceipt(payload),
	});
}

export async function sendReceiptToEmail(id: string) {
	const url = API_ROUTES.receipt.sendToEmail(id);
	return apiPost(url, {}) as Promise<any>;
}

export function useSendReceiptToEmail() {
	return useMutation({
		mutationFn: (id: string) => sendReceiptToEmail(id),
	});
}

export async function sendReceiptPdfToEmail(id: string, pdfBase64: string, recipientEmail?: string) {
	const url = API_ROUTES.receipt.sendToEmail(id);
	const payload = {
		pdfBase64,
		...(recipientEmail && { recipientEmail }),
	};
	return apiPost(url, payload) as Promise<any>;
}

export function useSendReceiptPdfToEmail() {
	return useMutation({
		mutationFn: ({ id, pdfBase64, recipientEmail }: { id: string; pdfBase64: string; recipientEmail?: string }) =>
			sendReceiptPdfToEmail(id, pdfBase64, recipientEmail),
	});
}

export async function trackReceiptDownload(id: string) {
	const url = API_ROUTES.receipt.trackDownload(id);
	return apiPost(url, {}) as Promise<any>;
}

export function useTrackReceiptDownload() {
	return useMutation({
		mutationFn: (id: string) => trackReceiptDownload(id),
	});
}
