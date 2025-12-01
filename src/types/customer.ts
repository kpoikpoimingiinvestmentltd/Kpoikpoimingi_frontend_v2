// Types for customer routes
export type CustomerDto = { id: string; name: string; email?: string };

export type Customer = {
	id: string;
	name: string;
	email: string;
	phone?: string;
	address?: string;
	status?: string;
	createdAt?: string;
	updatedAt?: string;
};

export type GetAllCustomersResponse = {
	data: Customer[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
};

export type CustomerRow = {
	id: string;
	fullName: string;
	email: string;
	phoneNumber?: string;
	status?: string;
	createdAt?: string;
};

export interface DeleteCustomerResponse {
	id: string;
	customerCode: string;
	fullName: string;
	email: string;
	registrations: Array<{
		id: string;
		registrationCode: string;
	}>;
}

export type MediaFile = { fileUrl?: string };

export type Registration = {
	dateOfBirth?: string;
	mediaFiles?: Record<string, MediaFile[]>;
	nextOfKin?: {
		fullName?: string;
		phoneNumber?: string;
		relationship?: string;
		isNextOfKinSpouse?: string;
		spouseFullName?: string;
		spousePhone?: string;
		spouseAddress?: string;
	};
	employmentDetails?: {
		employmentStatus?: { status?: string };
		employerName?: string;
		employerAddress?: string;
		companyName?: string;
		businessAddress?: string;
		homeAddress?: string;
	};
	propertyInterestRequest?: Array<{
		propertyName?: string;
		paymentInterval?: { intervals?: string };
		durationValue?: number;
		durationUnit?: { id?: number };
		downPayment?: number;
	}>;
	customPropertyName?: string;
	guarantors?: Array<{
		fullName?: string;
		occupation?: string;
		phoneNumber?: string;
		email?: string;
		employmentStatus?: { status?: string };
		homeAddress?: string;
		companyAddress?: string;
		businessAddress?: string;
		stateOfOrigin?: string;
	}>;
	purposeOfProperty?: string;
	previousHirePurchase?: string;
	previousCompany?: string;
	wasPreviousCompleted?: string;
};

export type CustomerDetails = {
	fullName?: string;
	email?: string;
	phoneNumber?: string;
	customerCode?: string;
	createdAt?: string;
	registrations?: Registration[];
	paymentTypeId?: number | string;
};
