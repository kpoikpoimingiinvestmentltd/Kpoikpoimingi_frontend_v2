/**
 * Reference Data Helper Functions
 *
 * Shared utility functions for extracting reference data from the backend
 * Used across multiple components (UserForm, CustomerForm, etc.)
 */

export interface RefOption {
	key: string;
	value: string;
}

/**
 * Extract role options from reference data
 * Looks for common role field names and structures
 */
export function extractRoleOptions(refData: any): RefOption[] {
	if (!refData) return [];

	const prefer = ["roles", "user_roles", "userRoles", "role", "roles_list"];
	for (const k of prefer) {
		const arr = (refData as any)[k];
		if (Array.isArray(arr) && arr.length) {
			return arr.map((it: any) => {
				const value = it.role || it.value || String(it);
				const key = String(it.id ?? value ?? "");
				return { key, value: String(value) };
			});
		}
	}

	// Fallback: scan for role-like arrays
	for (const [k, v] of Object.entries(refData)) {
		if (Array.isArray(v) && v.length) {
			const sample = v[0] as any;
			const t = String(sample.type ?? sample.key ?? "").toLowerCase();
			if (t.includes("role") || k.toLowerCase().includes("role")) {
				return (v as any[]).map((it: any) => {
					const value = it.role || it.value || String(it);
					const key = String(it.id ?? value ?? "");
					return { key, value: String(value) };
				});
			}
		}
	}

	return [];
}

/**
 * Extract bank options from reference data
 * Looks for bank name fields and structures
 */
export function extractBankOptions(refData: any): RefOption[] {
	if (!refData) return [];

	const prefer = ["bankNames", "banks", "bank_list", "banks_list"];
	for (const k of prefer) {
		const arr = (refData as any)[k];
		if (Array.isArray(arr) && arr.length) {
			return arr.map((it: any) => {
				const value = String(it.name ?? it.bank ?? it.value ?? it.key ?? "");
				const key = String(it.id ?? value ?? "");
				return { key, value };
			});
		}
	}

	// Fallback: scan for bank-like arrays
	for (const [k, v] of Object.entries(refData)) {
		if (Array.isArray(v) && v.length) {
			const sample = v[0] as any;
			if (String(sample.name ?? sample.bank ?? "").length > 0 && k.toLowerCase().includes("bank")) {
				return (v as any[]).map((it: any) => ({
					key: String(it.id ?? it.name ?? it.bank ?? ""),
					value: String(it.name ?? it.bank ?? it.value ?? ""),
				}));
			}
		}
	}

	return [];
}

/**
 * Extract account type options from reference data
 * Looks for account type fields and structures
 */
export function extractAccountTypeOptions(refData: any): RefOption[] {
	if (!refData) return [];

	const prefer = ["accountTypes", "account_types", "account_type", "accountType"];
	for (const k of prefer) {
		const arr = (refData as any)[k];
		if (Array.isArray(arr) && arr.length) {
			return arr.map((it: any) => {
				const value = String(it.type ?? it.name ?? it.accountType ?? it.value ?? it.key ?? "");
				const key = String(it.id ?? value ?? "");
				return { key, value };
			});
		}
	}

	// Fallback: scan for account-like arrays
	for (const [, v] of Object.entries(refData)) {
		if (Array.isArray(v) && v.length) {
			const sample = v[0] as any;
			if (
				String(sample.type ?? sample.name ?? "")
					.toLowerCase()
					.includes("account")
			) {
				return (v as any[]).map((it: any) => ({
					key: String(it.id ?? it.name ?? it.type ?? ""),
					value: String(it.name ?? it.type ?? it.value ?? ""),
				}));
			}
		}
	}

	return [];
}

/**
 * Extract state/region options from reference data
 * Looks for state field names and structures
 */
export function extractStateOptions(refData: any): RefOption[] {
	if (!refData) return [];

	const prefer = ["stateOfOrigins", "state_of_origins", "states", "state_list", "stateOfOrigin"];
	for (const k of prefer) {
		const arr = (refData as any)[k];
		if (Array.isArray(arr) && arr.length) {
			return arr.map((it: any) => {
				const value = String(it.state ?? it.name ?? it.value ?? "");
				const key = String(it.id ?? value ?? "");
				return { key, value };
			});
		}
	}

	// Fallback: scan for state-like arrays
	for (const [k, v] of Object.entries(refData)) {
		if (Array.isArray(v) && v.length) {
			const sample = v[0] as any;
			const t = String(sample.state ?? sample.name ?? "").toLowerCase();
			if (t.length > 0 && (t.includes("state") || k.toLowerCase().includes("state"))) {
				return (v as any[]).map((it: any) => ({
					key: String(it.id ?? it.state ?? it.name ?? ""),
					value: String(it.state ?? it.name ?? it.value ?? ""),
				}));
			}
		}
	}

	return [];
}

/**
 * Extract employment status options from reference data
 * Looks for employment status field names and structures
 */
export function extractEmploymentStatusOptions(refData: any): RefOption[] {
	if (!refData) return [];

	const prefer = ["employmentStatuses", "employment_statuses", "employmentStatus", "employment"];
	for (const k of prefer) {
		const arr = (refData as any)[k];
		if (Array.isArray(arr) && arr.length) {
			return arr.map((it: any) => {
				const value = String(it.status ?? it.type ?? it.name ?? it.value ?? "");
				const key = String(it.id ?? value ?? "");
				return { key, value };
			});
		}
	}

	// Fallback: scan for employment-like arrays
	for (const [k, v] of Object.entries(refData)) {
		if (Array.isArray(v) && v.length) {
			const sample = v[0] as any;
			const t = String(sample.type ?? sample.key ?? sample.status ?? "").toLowerCase();
			if (t.includes("employment") || t.includes("job") || t.includes("occupation") || k.toLowerCase().includes("employment")) {
				return (v as any[]).map((it: any) => ({
					key: String(it.id ?? it.status ?? it.type ?? it.name ?? ""),
					value: String(it.status ?? it.type ?? it.name ?? it.value ?? ""),
				}));
			}
		}
	}

	return [];
}

/**
 * Extract relationship type options from reference data
 * Looks for relationship field names and structures
 */
export function extractRelationshipOptions(refData: any): RefOption[] {
	if (!refData) return [];

	const prefer = ["relationships", "relationship", "relation_types", "relationshipTypes"];
	for (const k of prefer) {
		const arr = (refData as any)[k];
		if (Array.isArray(arr) && arr.length) {
			return arr.map((it: any) => {
				const value = String(it.type ?? it.relationship ?? it.name ?? it.value ?? "");
				const key = String(it.id ?? value ?? "");
				return { key, value };
			});
		}
	}

	// Fallback: scan for relationship-like arrays
	for (const [k, v] of Object.entries(refData)) {
		if (Array.isArray(v) && v.length) {
			const sample = v[0] as any;
			const t = String(sample.type ?? sample.key ?? "").toLowerCase();
			if (t.includes("relationship") || t.includes("relation") || k.toLowerCase().includes("relationship")) {
				return (v as any[]).map((it: any) => ({
					key: String(it.id ?? it.type ?? it.relationship ?? it.name ?? ""),
					value: String(it.type ?? it.relationship ?? it.name ?? it.value ?? ""),
				}));
			}
		}
	}

	return [];
}

/**
 * Extract payment frequency/interval options from reference data
 * Looks for frequency field names and structures
 */
export function extractPaymentFrequencyOptions(refData: any): RefOption[] {
	if (!refData) return [];

	const prefer = ["paymentIntervals", "payment_intervals", "frequencies", "payment_frequency", "paymentFrequencies"];
	for (const k of prefer) {
		const arr = (refData as any)[k];
		if (Array.isArray(arr) && arr.length) {
			return arr.map((it: any) => {
				const value = String(it.intervals ?? it.frequency ?? it.interval ?? it.name ?? it.value ?? "");
				const key = String(it.id ?? value ?? "");
				return { key, value };
			});
		}
	}

	// Fallback: scan for frequency-like arrays
	for (const [k, v] of Object.entries(refData)) {
		if (Array.isArray(v) && v.length) {
			const sample = v[0] as any;
			const t = String(sample.type ?? sample.key ?? "").toLowerCase();
			if (t.includes("frequency") || t.includes("interval") || k.toLowerCase().includes("frequency") || k.toLowerCase().includes("interval")) {
				return (v as any[]).map((it: any) => ({
					key: String(it.id ?? it.frequency ?? it.interval ?? it.name ?? ""),
					value: String(it.intervals ?? it.frequency ?? it.interval ?? it.name ?? it.value ?? ""),
				}));
			}
		}
	}

	return [];
}

/**
 * Extract payment duration unit options from reference data
 * Looks for duration unit field names and structures (WEEKS, MONTHS, YEARS)
 */
export function extractDurationUnitOptions(refData: any): RefOption[] {
	if (!refData) return [];

	const prefer = ["durationUnits", "duration_units", "durationUnit", "duration_unit"];
	for (const k of prefer) {
		const arr = (refData as any)[k];
		if (Array.isArray(arr) && arr.length) {
			return arr.map((it: any) => {
				const value = String(it.duration ?? it.unit ?? it.name ?? it.value ?? "");
				const key = String(it.id ?? value ?? "");
				return { key, value };
			});
		}
	}

	// Fallback: scan for duration-like arrays
	for (const [k, v] of Object.entries(refData)) {
		if (Array.isArray(v) && v.length) {
			const sample = v[0] as any;
			const t = String(sample.type ?? sample.key ?? sample.duration ?? "").toLowerCase();
			if (
				t.includes("duration") ||
				t.includes("unit") ||
				t.includes("weeks") ||
				t.includes("months") ||
				t.includes("years") ||
				k.toLowerCase().includes("duration")
			) {
				return (v as any[]).map((it: any) => ({
					key: String(it.id ?? it.duration ?? it.unit ?? it.name ?? ""),
					value: String(it.duration ?? it.unit ?? it.name ?? it.value ?? ""),
				}));
			}
		}
	}

	return [];
}
