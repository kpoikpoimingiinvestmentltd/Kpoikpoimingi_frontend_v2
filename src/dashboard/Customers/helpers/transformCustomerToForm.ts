import type { InstallmentPaymentForm, OncePaymentForm, FileUploadState } from "@/types/customerRegistration";

/**
 * Transform API mediaFiles to uploadedFiles state format
 */
export function transformMediaToUploadedFiles(mediaFiles: any): FileUploadState {
	if (!mediaFiles) return {};

	const result: FileUploadState = {};

	// Map identification documents
	if (mediaFiles.identificationDocument?.length > 0) {
		result.nin = mediaFiles.identificationDocument.map((file: any) => file.fileUrl);
	}

	// Map driver license
	if (mediaFiles.driverLicense?.length > 0) {
		result.driverLicense = mediaFiles.driverLicense.map((file: any) => file.fileUrl);
	}

	// Map indigene certificate
	if (mediaFiles.indegeneCertificate?.length > 0) {
		result.indigeneCertificate = mediaFiles.indegeneCertificate.map((file: any) => file.fileUrl);
	}

	// Map contract/signed contract
	if (mediaFiles.signedContract?.length > 0) {
		result.contract = mediaFiles.signedContract.map((file: any) => file.fileUrl);
	}

	// Map guarantor documents
	if (mediaFiles.guarantor_0_doc?.length > 0) {
		result.guarantor_0_doc = mediaFiles.guarantor_0_doc.map((file: any) => file.fileUrl);
	}
	if (mediaFiles.guarantor_1_doc?.length > 0) {
		result.guarantor_1_doc = mediaFiles.guarantor_1_doc.map((file: any) => file.fileUrl);
	}
	if (mediaFiles.guarantor_2_doc?.length > 0) {
		result.guarantor_2_doc = mediaFiles.guarantor_2_doc.map((file: any) => file.fileUrl);
	}

	return result;
}

/**
 * Transform API customer response to InstallmentPaymentForm structure
 */
export function transformCustomerToInstallmentForm(customer: any): InstallmentPaymentForm {
	if (!customer) {
		return null as any;
	}

	return {
		fullName: customer.fullName || customer.name || "",
		email: customer.email || "",
		whatsapp: customer.phoneNumber || customer.phone || "",
		dob: customer.dateOfBirth || "",
		address: customer.homeAddress || customer.employmentDetails?.homeAddress || customer.address || "",
		isDriver:
			customer.isDriver === "Yes" || customer.isDriver === true
				? true
				: customer.isDriver === "No" || customer.isDriver === false
				? false
				: undefined,
		nextOfKin: {
			fullName: customer.nextOfKin?.fullName || "",
			phone: customer.nextOfKin?.phoneNumber || customer.nextOfKin?.phone || "",
			relationship: customer.nextOfKin?.relationship || "",
			spouseName: customer.nextOfKin?.spouseFullName || customer.nextOfKin?.spouseName || "",
			spousePhone: customer.nextOfKin?.spousePhone || "",
			address: customer.nextOfKin?.spouseAddress || customer.nextOfKin?.address || "",
		},
		propertyName: customer.propertyInterestRequest?.[0]?.customPropertyName || "",
		paymentFrequency: String(customer.propertyInterestRequest?.[0]?.paymentIntervalId || ""),
		paymentDuration: String(customer.propertyInterestRequest?.[0]?.durationValue || ""),
		paymentDurationUnit: String(customer.propertyInterestRequest?.[0]?.durationUnitId || ""),
		downPayment: String(customer.propertyInterestRequest?.[0]?.downPayment || customer.downPayment || ""),
		amountAvailable: customer.propertyInterestRequest?.[0]?.downPayment ? String(customer.propertyInterestRequest[0].downPayment) : "",
		clarification: {
			previousAgreement: customer.previousHirePurchase === "Yes" ? true : customer.previousHirePurchase === "No" ? false : null,
			completedAgreement: customer.wasPreviousCompleted === "Yes" ? true : customer.wasPreviousCompleted === "No" ? false : null,
			prevCompany: customer.previousCompany || "",
			reason: customer.purposeOfProperty || "",
		},
		employment: {
			status: String(customer.employmentDetails?.employmentStatusId || ""),
			employerName: customer.employmentDetails?.employerName || "",
			employerAddress: customer.employmentDetails?.employerAddress || "",
			companyName: customer.employmentDetails?.companyName || "",
			businessAddress: customer.employmentDetails?.businessAddress || "",
			homeAddress: customer.employmentDetails?.homeAddress || "",
		},
		guarantors: (customer.guarantors || []).map((g: any) => ({
			fullName: g.fullName || "",
			occupation: g.occupation || "",
			phone: g.phoneNumber || g.phone || "",
			email: g.email || "",
			employmentStatus: String(g.employmentStatusId || ""),
			homeAddress: g.homeAddress || g.address || "",
			businessAddress: g.companyAddress || g.businessAddress || "",
			stateOfOrigin: String(g.stateOfOrigin || ""),
			votersUploaded: g.votersUploaded || 0,
		})),
	};
}

/**
 * Transform API customer response to OncePaymentForm structure
 */
export function transformCustomerToOnceForm(customer: any): OncePaymentForm {
	if (!customer) {
		return null as any;
	}

	return {
		fullName: customer.fullName || customer.name || "",
		email: customer.email || "",
		whatsapp: customer.phoneNumber || customer.phone || "",
		numberOfProperties: String(customer.propertyInterestRequest?.length || 0),
		properties: (customer.propertyInterestRequest || []).map((prop: any) => ({
			propertyName: prop.customPropertyName || "",
			quantity: prop.quantity || 1,
		})),
	};
}

/**
 * Determine which payment method the customer used
 */
export function getCustomerPaymentMethod(customer: any): "once" | "installment" | undefined {
	if (!customer) return undefined;

	// Check if customer has paymentTypeId
	if (customer.paymentTypeId === 1) return "once";
	if (customer.paymentTypeId === 2) return "installment";

	// Fallback: check structure
	if (customer.propertyInterestRequest && customer.propertyInterestRequest.length > 0) {
		return "installment";
	}

	if (customer.properties && customer.properties.length > 0) {
		return "once";
	}

	// Default to installment
	return "installment";
}
