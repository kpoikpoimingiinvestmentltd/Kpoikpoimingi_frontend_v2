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
		id: "2026-10-02-purchase-acquisition",
		date: "2026-10-02",
		title: "Purchases & acquisition costs",
		summary:
			"You can now record how properties were bought (individually or in batches) with clear acquisition costs, and set listing price by selling price or markup.",
		bullets: [
			"Add a property with Individual purchase, Part of a new batch, or Part of an existing batch.",
			"On older properties with no purchase record, open the property and use Add Acquisition.",
			"Track purchase price, transportation, and miscellaneous fees; batch fees can be split equally, by purchase price, or manually.",
			"Choose Manual selling price or Cost + markup when setting the listing price.",
			"View acquisition details on the property page, and use Edit Acquisition to correct purchase costs.",
			"Open Purchases under Properties to browse batches and open batch details (with the usual Go back button).",
		],
	},
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
