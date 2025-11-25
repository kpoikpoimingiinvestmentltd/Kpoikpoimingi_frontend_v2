// Types for reports
export type ReportDto = { id: string; name?: string };

export type PenaltyRecord = {
	contractCode: string;
	propertyName: string;
	customerName: string;
	totalAmount: number;
	lateFee: number;
	interestRate: string;
	dueDate: string;
};

export type PaginationMeta = {
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
};

export type PenaltiesResponse = {
	data: PenaltyRecord[];
	pagination: PaginationMeta;
};

export type VATRecord = {
	id: string;
	contractId: string;
	paymentId: string | null;
	receiptId: string | null;
	customerId: string;
	amount: string;
	vatAmount: string;
	vatRate: string;
	paymentType: string | null;
	paymentMethod: string | null;
	generatedFrom: string;
	createdAt: string;
	updatedAt: string;
	contract: {
		contractCode: string;
	};
	customer: {
		fullName: string;
	};
};

export type VATTotals = {
	totalAmount: number;
	totalVatAmount: number;
	totalSystemAmount: number;
	recordsCount: number;
};

export type VATResponse = {
	data: VATRecord[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
	totals: VATTotals;
};

export type DateRange = {
	startDate: string;
	endDate: string;
};

export type IncomeEarnedResponse = {
	totalIncomeEarned: number;
	period: string;
	dateRange: DateRange;
};

export type VatCollectedResponse = {
	totalVatCollected: number;
	period: string;
	dateRange: DateRange;
};

export type InterestPenaltiesResponse = {
	totalInterestPenalties: number;
	period: string;
	dateRange: DateRange;
};
