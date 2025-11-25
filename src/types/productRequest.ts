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

export type ProductRequestActionResponse = ApproveRegistrationResponse | DeclineRegistrationResponse | DeleteRegistrationResponse;
