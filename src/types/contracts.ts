// Types for contracts
export type ContractDto = { id: string; reference: string };

export type ContractPayload = {
	customerId?: string;
	propertyId?: string | undefined;
	paymentTypeId?: number;
	quantity?: number;
	downPayment?: number;
	intervalId?: number | undefined;
	durationValue?: number;
	durationUnitId?: number | undefined;
	startDate?: string | undefined;
	remarks?: string | undefined;
	isCash?: boolean;
	isPaymentLink?: boolean;
};
