/**
 * Role-based access control configuration for pages and features
 *
 * Rules by image:
 * 1. Download receipt - ADMIN and SUPER_ADMIN
 * 2. VAT and interest in general settings - SUPER_ADMIN only
 * 3. Audit and Compliance - ADMIN and SUPER_ADMIN
 * 4. Users - SUPER_ADMIN only
 * 5. STAFF cannot delete, export, send emails, terminate contracts, or decline requests
 */

export const ROLE_BASED_ACCESS = {
	// Pages only accessible by SUPER_ADMIN
	users: ["SUPER_ADMIN"],
	vATAndInterestSettings: ["SUPER_ADMIN"],

	// Pages accessible by ADMIN and SUPER_ADMIN
	auditAndCompliance: ["ADMIN", "SUPER_ADMIN"],
	receiptDownload: ["ADMIN", "SUPER_ADMIN"],
	reportAnalytics: ["ADMIN", "SUPER_ADMIN"],
	notificationsSendEmails: ["ADMIN", "SUPER_ADMIN"],
	productRequestDecline: ["ADMIN", "SUPER_ADMIN"],
	contractTerminate: ["ADMIN", "SUPER_ADMIN"],

	// Delete operations - ADMIN and SUPER_ADMIN only (STAFF cannot delete)
	delete: ["ADMIN", "SUPER_ADMIN"],
	export: ["ADMIN", "SUPER_ADMIN"],

	// Pages accessible by everyone (no restrictions)
	dashboard: ["STAFF", "ADMIN", "SUPER_ADMIN"],
	customers: ["STAFF", "ADMIN", "SUPER_ADMIN"],
	properties: ["STAFF", "ADMIN", "SUPER_ADMIN"],
	receipt: ["STAFF", "ADMIN", "SUPER_ADMIN"],
	payment: ["STAFF", "ADMIN", "SUPER_ADMIN"],
	debt: ["STAFF", "ADMIN", "SUPER_ADMIN"],
	contract: ["STAFF", "ADMIN", "SUPER_ADMIN"],
	productRequest: ["STAFF", "ADMIN", "SUPER_ADMIN"],
};

export const USER_ROLES = {
	SUPER_ADMIN: "SUPER_ADMIN",
	ADMIN: "ADMIN",
	STAFF: "STAFF",
};
