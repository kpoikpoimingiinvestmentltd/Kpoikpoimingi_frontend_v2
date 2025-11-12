// Types for customer registration routes

export interface NextOfKinData {
	fullName: string;
	relationship: string;
	phoneNumber: string;
	spouseFullName?: string;
	spousePhone?: string;
	spouseAddress?: string;
	isNextOfKinSpouse?: string;
}

export interface GuarantorData {
	fullName: string;
	occupation: string;
	employmentStatusId: number | string;
	address: string;
	stateOfOrigin: string;
	phoneNumber: string;
	companyAddress: string;
	homeAddress: string;
	email: string;
	guarantorAgreement: string;
	guarantorAgreementAt: string;
}

export interface EmploymentDetailsData {
	employmentStatusId: number | string;
	employerName: string;
	employerAddress: string;
	companyName?: string;
	businessAddress?: string;
	homeAddress?: string;
}

export interface PropertyInterestRequest {
	propertyId?: string;
	paymentIntervalId: number | string;
	durationValue: number;
	durationUnitId: number | string;
	downPayment: number;
	quantity: number;
	isAssigned?: boolean;
	isCustomProperty?: boolean;
	customPropertyName?: string;
	customPropertyPrice?: number;
}

export interface MediaKeys {
	identificationDocument?: string[];
	indegeneCertificate?: string[];
	driverLicense?: string[];
	[key: string]: string[] | undefined;
}

export interface CustomerRegistrationPayload {
	fullName: string;
	email: string;
	homeAddress: string;
	phoneNumber: string;
	paymentTypeId: number | string;
	isDriver: string;
	requestAgreement: string;
	requestAgreementAt: string;
	dateOfBirth: string;
	purposeOfProperty: string;
	downPayment: number;
	previousHirePurchase: string;
	previousCompany?: string;
	wasPreviousCompleted?: string;
	nextOfKin: NextOfKinData;
	guarantors: GuarantorData[];
	employmentDetails: EmploymentDetailsData;
	propertyInterestRequest: PropertyInterestRequest[];
	mediaKeys: MediaKeys;
}

export interface CustomerRegistrationResponse {
	id: string;
	registrationCode: string;
	fullName: string;
	email: string;
	customerId: string;
	message: string;
	status: string;
}

export type CustomerRegistrationDto = { id: string; status?: string };

// Form-related types
export interface PropertyItem {
	propertyName: string;
	quantity: number;
}

export interface FileUploadState {
	nin?: string[];
	driverLicense?: string[];
	contract?: string[];
	indigeneCertificate?: string[];
	[guarantorIdx: string]: string[] | undefined;
}

export interface OncePaymentForm {
	fullName: string;
	email: string;
	whatsapp: string;
	numberOfProperties: string;
	properties: PropertyItem[];
}

export interface InstallmentPaymentForm {
	fullName: string;
	email: string;
	whatsapp: string;
	dob: string;
	address: string;
	isDriver?: boolean;
	nextOfKin: {
		fullName: string;
		phone: string;
		relationship: string;
		spouseName: string;
		spousePhone: string;
		address: string;
	};
	propertyName: string;
	paymentFrequency: string;
	paymentDuration: string;
	paymentDurationUnit: string;
	downPayment: string;
	amountAvailable: string;
	clarification: {
		previousAgreement: boolean | null;
		completedAgreement: boolean | null;
		prevCompany: string;
		reason: string;
	};
	employment: {
		status: string;
		employerName: string;
		employerAddress: string;
		companyName: string;
		businessAddress: string;
		homeAddress: string;
	};
	guarantors: Array<{
		fullName: string;
		occupation: string;
		phone: string;
		email: string;
		employmentStatus: string;
		homeAddress: string;
		businessAddress: string;
		stateOfOrigin: string;
		votersUploaded: number;
	}>;
}

export interface FullPaymentProperty {
	propertyId: string;
	quantity: number;
	isCustomProperty: boolean;
}

export interface InternalFullPaymentRegistrationPayload {
	fullName: string;
	email: string;
	phoneNumber: string;
	paymentTypeId: number | string;
	properties: FullPaymentProperty[];
}

export interface FullPaymentRegistrationResponse {
	id: string;
	registrationCode: string;
	fullName: string;
	email: string;
	customerId: string;
	message: string;
	status: string;
}
