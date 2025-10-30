import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPut } from "@/services/apiClient";
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
	// API expects { percentage: 0.075 }
	const body: any = (payload as any)?.percentage !== undefined ? { percentage: (payload as any).percentage } : { percentage: payload.vat };
	return apiPut(API_ROUTES.settings.updateVATRate, body) as Promise<any>;
}

export async function updateInterestRate(payload: { interest: number }) {
	// API expects { interestRate: 0.2 }
	const body: any =
		(payload as any)?.interestRate !== undefined ? { interestRate: (payload as any).interestRate } : { interestRate: payload.interest };
	return apiPut(API_ROUTES.settings.updateInterestRate, body) as Promise<any>;
}

export async function updatePenaltyInterestRate(payload: { interest: number }) {
	// API expects { interestRate: 0.05 }
	const body: any =
		(payload as any)?.interestRate !== undefined ? { interestRate: (payload as any).interestRate } : { interestRate: payload.interest };
	return apiPut(API_ROUTES.settings.updatePenaltyInterestRate, body) as Promise<any>;
}

export function useUpdateVAT() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (p: { vat?: number; percentage?: number }) => updateVATRate(p as any),
		onSuccess: () => {
			// refresh system settings so UI reflects updated VAT in real-time
			qc.invalidateQueries({ queryKey: ["systemSettings"] });
		},
	} as any);
}

export function useUpdateInterest() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (p: { interest?: number; interestRate?: number }) => updateInterestRate(p as any),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["systemSettings"] }),
	} as any);
}

export function useUpdatePenaltyInterest() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (p: { interest?: number; interestRate?: number }) => updatePenaltyInterestRate(p as any),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["systemSettings"] }),
	} as any);
}

export default {};
