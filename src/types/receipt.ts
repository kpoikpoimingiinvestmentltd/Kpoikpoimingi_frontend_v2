// Types for receipt
export type ReceiptDto = { id: string; amount: number };

export type GenerateReceiptPayload = {
	customerId: string;
	amount: string | number;
	paymentMethodId: string | number;
	paymentDate: string;
	generatedBy: string;
	notes?: string;
};

export type ReceiptListItem = {
	id: string;
	receiptNumber?: string;
	paymentId?: string;
	customerId?: string;
	contractId?: string;
	propertyName?: string;
	amountPaid?: string | number;
	totalAmount?: string | number;
	paymentDate?: string;
	paymentMethod?: { id?: number; method?: string } | string;
	createdAt?: string;
	updatedAt?: string;
	customer?: { id?: string; fullName?: string; phoneNumber?: string };
	contract?: { id?: string; contractCode?: string; property?: { name?: string; price?: string } };
};

export type ReceiptDetail = {
	id: string;
	receiptNumber?: string;
	paymentId?: string;
	customerId?: string;
	contractId?: string;
	propertyName?: string;
	amountPaid?: string | number;
	paymentDate?: string;
	paymentMethodId?: number;
	issuedById?: string;
	issuedBy?: { id?: string; fullName?: string };
	vatAmount?: string | number;
	vatUsed?: string | number;
	totalAmount?: string | number;
	interest?: number;
	nextPaymentDate?: string;
	createdAt?: string;
	updatedAt?: string;
	statusId?: number;
	source?: string;
	contract?: {
		id?: string;
		contractCode?: string;
		property?: { name?: string; price?: string };
		durationValue?: number;
		durationUnit?: { duration?: string };
	};
	customer?: { id?: string; fullName?: string; phoneNumber?: string };
	installmentProgress?: string;
	totalInstallments?: number;
};
