export type ProductUpdate = {
	id: string;
	date: string; // YYYY-MM-DD
	title: string;
	summary: string;
	bullets?: string[];
};

/**
 * Newest first. Bump / add an entry when shipping user-facing changes.
 * Users who haven't seen the latest id get the "What's new" modal on dashboard entry.
 */
export const PRODUCT_UPDATES: ProductUpdate[] = [
	{
		id: "2026-09-08-staff-codes",
		date: "2026-09-08",
		title: "Staff codes on receipts",
		summary:
			"Receipts now identify staff with a code instead of a full name, so customer copies stay professional while admins can still see who issued them.",
		bullets: [
			"Every staff member has a code like ST-0001, ST-0002 (grows past 9999 automatically).",
			"Printed / shared receipts show: Receipt granted by: ST-0002.",
			"On the admin screen you’ll also see the name: ST-0002 · Jane Doe.",
			"Staff codes appear in the Users list under “Staff Code”.",
		],
	},
];

export function getLatestUpdateId(): string | null {
	return PRODUCT_UPDATES[0]?.id ?? null;
}
