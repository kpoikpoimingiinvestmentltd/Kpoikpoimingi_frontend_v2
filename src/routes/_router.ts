export const _router = {
	auth: { index: "/auth", login: "/auth/login", forgotpassword: "/auth/forgot-password", resetpassword: "/auth/reset-password" },
	dashboard: {
		index: "/dashboard",
		customers: "/dashboard/customers",
		customerDetails: "/dashboard/customers/:id",
		properties: "/dashboard/properties",
		receipt: "/dashboard/receipt",
		settings: "/dashboard/settings",
		contract: "/dashboard/contract",
		debt: "/dashboard/debt",
		payment: "/dashboard/payment",
		reportAnalytics: "/dashboard/report-analytics",
		auditAndCompliance: "/dashboard/audit-and-compliance",
		users: "/dashboard/users",
		userDetails: "/dashboard/users/:id",
	},
};
