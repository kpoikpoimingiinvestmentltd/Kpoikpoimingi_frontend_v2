export type ProductRequestItem = {
	id: string;
	name: string;
	propertyType: string;
	paymentMethod: string;
	totalAmount: number;
	status: string;
	dateCreated: string;
};

export type ProductRequestResponse = {
	pagination: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean };
	data: ProductRequestItem[];
};

export type ApproveRegistrationResponse = {
	id: string;
	registrationCode: string;
	fullName: string;
	email: string;
	customerId?: string;
	message: string;
	status: "approved" | string;
};

export type DeclineRegistrationResponse = {
	id: string;
	registrationCode: string;
	fullName: string;
	email: string;
	message: string;
	status: "declined" | string;
};

export type DeleteRegistrationResponse = {
	id: string;
	registrationCode?: string;
	message?: string;
};

export type SendContractResponse = {
	id: string;
	message: string;
};

export type ProductRequestActionResponse = ApproveRegistrationResponse | DeclineRegistrationResponse | DeleteRegistrationResponse;

export type PropertyInterest = {
	id: string;
	propertyId?: string | null;
	paymentIntervalId?: number | null;
	durationValue?: number | null;
	durationUnitId?: number | null;
	downPayment?: string | number | null;
	isAssigned?: boolean;
	customerRegistrationId?: string;
	customPropertyName?: string | null;
	customPropertyPrice?: string | number | null;
	isCustomProperty?: boolean;
	quantity?: number;
};

export type CustomerRegistration = {
	propertyInterestRequest?: PropertyInterest[];
	purposeOfProperty?: string;
	[key: string]: unknown;
};
