// Types for payment
export type PaymentDto = { id: string; amount: number };

// API shape for an individual payment item returned under a customer's payments
export type ApiPaymentItem = {
	id: string;
	reference?: string;
	amount?: string | number;
	receiptNumber?: string;
	outStandingBalance?: string | number;
	outstandingBalance?: string | number;
	paymentMethod?: string;
	status?: string;
	createdAt?: string;
};

// API shape for payments grouped by contract
export type ApiContractPayments = {
	contractId?: string;
	contractCode?: string;
	propertyName?: string;
	propertyPrice?: string | number;
	payments?: ApiPaymentItem[];
};
