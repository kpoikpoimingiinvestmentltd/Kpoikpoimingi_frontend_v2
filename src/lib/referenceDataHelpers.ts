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

type ReferenceData = Record<string, unknown>;

/**
 * Extract role options from reference data
 * Looks for common role field names and structures
 */
export function extractRoleOptions(refData: unknown): RefOption[] {
	if (!refData || typeof refData !== "object") return [];

	const data = refData as ReferenceData;
	const prefer = ["roles", "user_roles", "userRoles", "role", "roles_list"];
	for (const k of prefer) {
		const arr = data[k];
		if (Array.isArray(arr) && arr.length) {
			return arr.map((it: unknown) => {
				const item = it as Record<string, unknown>;
				const value = item.role || item.value || String(it);
				const key = String(item.id ?? value ?? "");
				return { key, value: String(value) };
			});
		}
	}

	// Fallback: scan for role-like arrays
	for (const [k, v] of Object.entries(data)) {
		if (Array.isArray(v) && v.length) {
			const sample = v[0] as Record<string, unknown>;
			const t = String(sample.type ?? sample.key ?? "").toLowerCase();
			if (t.includes("role") || k.toLowerCase().includes("role")) {
				return v.map((it: unknown) => {
					const item = it as Record<string, unknown>;
					const value = item.role || item.value || String(it);
					const key = String(item.id ?? value ?? "");
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
export function extractBankOptions(refData: unknown): RefOption[] {
	if (!refData || typeof refData !== "object") return [];

	const data = refData as ReferenceData;
	const prefer = ["bankNames", "banks", "bank_list", "banks_list"];
	for (const k of prefer) {
		const arr = data[k];
		if (Array.isArray(arr) && arr.length) {
			return arr.map((it: unknown) => {
				const item = it as Record<string, unknown>;
				const value = String(item.name ?? item.bank ?? item.value ?? item.key ?? "");
				const key = String(item.id ?? value ?? "");
				return { key, value };
			});
		}
	}

	// Fallback: scan for bank-like arrays
	for (const [k, v] of Object.entries(data)) {
		if (Array.isArray(v) && v.length) {
			const sample = v[0] as Record<string, unknown>;
			if (String(sample.name ?? sample.bank ?? "").length > 0 && k.toLowerCase().includes("bank")) {
				return v.map((it: unknown) => {
					const item = it as Record<string, unknown>;
					return {
						key: String(item.id ?? item.name ?? item.bank ?? ""),
						value: String(item.name ?? item.bank ?? item.value ?? ""),
					};
				});
			}
		}
	}

	return [];
}

/**
 * Extract account type options from reference data
 * Looks for account type fields and structures
 */
export function extractAccountTypeOptions(refData: unknown): RefOption[] {
	if (!refData || typeof refData !== "object") return [];

	const data = refData as ReferenceData;
	const prefer = ["accountTypes", "account_types", "account_type", "accountType"];
	for (const k of prefer) {
		const arr = data[k];
		if (Array.isArray(arr) && arr.length) {
			return arr.map((it: unknown) => {
				const item = it as Record<string, unknown>;
				const value = String(item.type ?? item.name ?? item.accountType ?? item.value ?? item.key ?? "");
				const key = String(item.id ?? value ?? "");
				return { key, value };
			});
		}
	}

	// Fallback: scan for account-like arrays
	for (const [, v] of Object.entries(data)) {
		if (Array.isArray(v) && v.length) {
			const sample = v[0] as Record<string, unknown>;
			if (
				String(sample.type ?? sample.name ?? "")
					.toLowerCase()
					.includes("account")
			) {
				return v.map((it: unknown) => {
					const item = it as Record<string, unknown>;
					return {
						key: String(item.id ?? item.name ?? item.type ?? ""),
						value: String(item.name ?? item.type ?? item.value ?? ""),
					};
				});
			}
		}
	}

	return [];
}

/**
 * Extract state/region options from reference data
 * Looks for state field names and structures
 */
export function extractStateOptions(refData: unknown): RefOption[] {
	if (!refData || typeof refData !== "object") return [];

	const data = refData as ReferenceData;
	const prefer = ["stateOfOrigins", "state_of_origins", "states", "state_list", "stateOfOrigin"];
	for (const k of prefer) {
		const arr = data[k];
		if (Array.isArray(arr) && arr.length) {
			return arr.map((it: unknown) => {
				const item = it as Record<string, unknown>;
				const value = String(item.state ?? item.name ?? item.value ?? "");
				const key = String(item.id ?? value ?? "");
				return { key, value };
			});
		}
	}

	// Fallback: scan for state-like arrays
	for (const [k, v] of Object.entries(data)) {
		if (Array.isArray(v) && v.length) {
			const sample = v[0] as Record<string, unknown>;
			const t = String(sample.state ?? sample.name ?? "").toLowerCase();
			if (t.length > 0 && (t.includes("state") || k.toLowerCase().includes("state"))) {
				return v.map((it: unknown) => {
					const item = it as Record<string, unknown>;
					return {
						key: String(item.id ?? item.state ?? item.name ?? ""),
						value: String(item.state ?? item.name ?? item.value ?? ""),
					};
				});
			}
		}
	}

	return [];
}

/**
 * Extract employment status options from reference data
 * Looks for employment status field names and structures
 */
export function extractEmploymentStatusOptions(refData: unknown): RefOption[] {
	if (!refData || typeof refData !== "object") return [];

	const data = refData as ReferenceData;
	const prefer = ["employmentStatuses", "employment_statuses", "employmentStatus", "employment"];
	for (const k of prefer) {
		const arr = data[k];
		if (Array.isArray(arr) && arr.length) {
			return arr.map((it: unknown) => {
				const item = it as Record<string, unknown>;
				const value = String(item.status ?? item.type ?? item.name ?? item.value ?? "");
				const key = String(item.id ?? value ?? "");
				return { key, value };
			});
		}
	}

	// Fallback: scan for employment-like arrays
	for (const [k, v] of Object.entries(data)) {
		if (Array.isArray(v) && v.length) {
			const sample = v[0] as Record<string, unknown>;
			const t = String(sample.type ?? sample.key ?? sample.status ?? "").toLowerCase();
			if (t.includes("employment") || t.includes("job") || t.includes("occupation") || k.toLowerCase().includes("employment")) {
				return v.map((it: unknown) => {
					const item = it as Record<string, unknown>;
					return {
						key: String(item.id ?? item.status ?? item.type ?? item.name ?? ""),
						value: String(item.status ?? item.type ?? item.name ?? item.value ?? ""),
					};
				});
			}
		}
	}

	return [];
}

/**
 * Extract relationship type options from reference data
 * Looks for relationship field names and structures
 */
export function extractRelationshipOptions(refData: unknown): RefOption[] {
	if (!refData || typeof refData !== "object") return [];

	const data = refData as ReferenceData;
	const prefer = ["relationships", "relationship", "relation_types", "relationshipTypes"];
	for (const k of prefer) {
		const arr = data[k];
		if (Array.isArray(arr) && arr.length) {
			return arr.map((it: unknown) => {
				const item = it as Record<string, unknown>;
				const value = String(item.type ?? item.relationship ?? item.name ?? item.value ?? "");
				const key = String(item.id ?? value ?? "");
				return { key, value };
			});
		}
	}

	// Fallback: scan for relationship-like arrays
	for (const [k, v] of Object.entries(data)) {
		if (Array.isArray(v) && v.length) {
			const sample = v[0] as Record<string, unknown>;
			const t = String(sample.type ?? sample.key ?? "").toLowerCase();
			if (t.includes("relationship") || t.includes("relation") || k.toLowerCase().includes("relationship")) {
				return v.map((it: unknown) => {
					const item = it as Record<string, unknown>;
					return {
						key: String(item.id ?? item.type ?? item.relationship ?? item.name ?? ""),
						value: String(item.type ?? item.relationship ?? item.name ?? item.value ?? ""),
					};
				});
			}
		}
	}

	return [];
}

/**
 * Extract payment frequency/interval options from reference data
 * Looks for frequency field names and structures
 */
export function extractPaymentFrequencyOptions(refData: unknown): RefOption[] {
	if (!refData || typeof refData !== "object") return [];

	const data = refData as ReferenceData;
	const prefer = ["paymentIntervals", "payment_intervals", "frequencies", "payment_frequency", "paymentFrequencies"];
	for (const k of prefer) {
		const arr = data[k];
		if (Array.isArray(arr) && arr.length) {
			return arr.map((it: unknown) => {
				const item = it as Record<string, unknown>;
				const value = String(item.intervals ?? item.frequency ?? item.interval ?? item.name ?? item.value ?? "");
				const key = String(item.id ?? value ?? "");
				return { key, value };
			});
		}
	}

	// Fallback: scan for frequency-like arrays
	for (const [k, v] of Object.entries(data)) {
		if (Array.isArray(v) && v.length) {
			const sample = v[0] as Record<string, unknown>;
			const t = String(sample.type ?? sample.key ?? "").toLowerCase();
			if (t.includes("frequency") || t.includes("interval") || k.toLowerCase().includes("frequency") || k.toLowerCase().includes("interval")) {
				return v.map((it: unknown) => {
					const item = it as Record<string, unknown>;
					return {
						key: String(item.id ?? item.frequency ?? item.interval ?? item.name ?? ""),
						value: String(item.intervals ?? item.frequency ?? item.interval ?? item.name ?? item.value ?? ""),
					};
				});
			}
		}
	}

	return [];
}

/**
 * Extract payment duration unit options from reference data
 * Looks for duration unit field names and structures (WEEKS, MONTHS, YEARS)
 */
export function extractDurationUnitOptions(refData: unknown): RefOption[] {
	if (!refData || typeof refData !== "object") return [];

	const data = refData as ReferenceData;
	const prefer = ["durationUnits", "duration_units", "durationUnit", "duration_unit"];
	for (const k of prefer) {
		const arr = data[k];
		if (Array.isArray(arr) && arr.length) {
			return arr.map((it: unknown) => {
				const item = it as Record<string, unknown>;
				const value = String(item.duration ?? item.unit ?? item.name ?? item.value ?? "");
				const key = String(item.id ?? value ?? "");
				return { key, value };
			});
		}
	}

	// Fallback: scan for duration-like arrays
	for (const [k, v] of Object.entries(data)) {
		if (Array.isArray(v) && v.length) {
			const sample = v[0] as Record<string, unknown>;
			const t = String(sample.type ?? sample.key ?? sample.duration ?? "").toLowerCase();
			if (
				t.includes("duration") ||
				t.includes("unit") ||
				t.includes("weeks") ||
				t.includes("months") ||
				t.includes("years") ||
				k.toLowerCase().includes("duration")
			) {
				return v.map((it: unknown) => {
					const item = it as Record<string, unknown>;
					return {
						key: String(item.id ?? item.duration ?? item.unit ?? item.name ?? ""),
						value: String(item.duration ?? item.unit ?? item.name ?? item.value ?? ""),
					};
				});
			}
		}
	}

	return [];
}
