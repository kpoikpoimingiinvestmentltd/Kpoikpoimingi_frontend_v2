// Types for analytics
export type AnalyticsOverview = {
	totalPropertyRequests: number;
	unapprovedRequests: number;
	totalPropertiesSold: number;
	totalCustomers: number;
	propertyRequestInfo: {
		approved: number;
		pending: number;
		total: number;
	};
	reportAnalytics: {
		totalIncomeEarned: number;
		totalVATCollected: number;
		totalInterestPenalties: number;
	};
};

export type MonthlyIncomeData = {
	month: number;
	monthName: string;
	income: number;
};

export type IncomeAnalytics = {
	totalIncome: number;
	fullPayment: number;
	hirePurchase: number;
	unpaidDebt: number;
	monthlyIncomeData: MonthlyIncomeData[];
};
