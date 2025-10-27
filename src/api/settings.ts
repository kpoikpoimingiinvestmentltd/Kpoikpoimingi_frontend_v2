import { useQuery, useMutation } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/services/apiClient";
import { API_ROUTES } from "./routes";

export type SystemSettings = {
	vatRate?: number;
	interestRate?: number;
	penaltyInterestRate?: number;
};

export async function getSystemSettings(): Promise<SystemSettings> {
	const d: any = await apiGet(API_ROUTES.settings.getSystemSettings);

	const vatRaw = d?.customerVATRates ?? d?.customerVATRate ?? d?.vatRate ?? d?.customerVatRate ?? d?.customer_vat_rate;
	const interestRaw = d?.interestRate ?? d?.interest;
	const penaltyRaw = d?.penaltyInterestRate ?? d?.penaltyInterest;

	const parseNumber = (v: any) => {
		if (v === null || v === undefined || v === "") return undefined;
		const n = Number(typeof v === "string" ? v.trim() : v);
		return Number.isFinite(n) ? n : undefined;
	};

	const vatRate = parseNumber(vatRaw);
	const interestRate = parseNumber(interestRaw);
	const penaltyInterestRate = parseNumber(penaltyRaw);

	return { vatRate, interestRate, penaltyInterestRate } as SystemSettings;
}

export function useGetSystemSettings(enabled = true) {
	return useQuery<SystemSettings>({ queryKey: ["systemSettings"], queryFn: getSystemSettings, enabled });
}

export async function updateVATRate(payload: { vat: number }) {
	return apiPatch(API_ROUTES.settings.updateVATRate, payload) as Promise<any>;
}

export async function updateInterestRate(payload: { interest: number }) {
	return apiPatch(API_ROUTES.settings.updateInterestRate, payload) as Promise<any>;
}

export async function updatePenaltyInterestRate(payload: { interest: number }) {
	return apiPatch(API_ROUTES.settings.updatePenaltyInterestRate, payload) as Promise<any>;
}

export function useUpdateVAT() {
	return useMutation({ mutationFn: (p: { vat: number }) => updateVATRate(p) } as any);
}

export function useUpdateInterest() {
	return useMutation({ mutationFn: (p: { interest: number }) => updateInterestRate(p) } as any);
}

export function useUpdatePenaltyInterest() {
	return useMutation({ mutationFn: (p: { interest: number }) => updatePenaltyInterestRate(p) } as any);
}

export default {};
