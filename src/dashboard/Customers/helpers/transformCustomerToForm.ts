import type { InstallmentPaymentForm, OncePaymentForm, FileUploadState } from "@/types/customerRegistration";

/**
 * Transform API mediaFiles to uploadedFiles state format
 */
export function transformMediaToUploadedFiles(mediaFiles: unknown): FileUploadState {
	if (!mediaFiles || typeof mediaFiles !== "object") return {};

	const mf = mediaFiles as Record<string, unknown>;
	const result: FileUploadState = {};

	const mapFileArray = (key: string) => {
		const arr = mf[key];
		if (Array.isArray(arr) && arr.length > 0) {
			return arr
				.map((f) => (f && typeof f === "object" ? (f as Record<string, unknown>).fileUrl : undefined))
				.filter((u): u is string => typeof u === "string");
		}
		return undefined;
	};

	result.nin = mapFileArray("identificationDocument");
	result.driverLicense = mapFileArray("driverLicense");
	result.indigeneCertificate = mapFileArray("indegeneCertificate");
	result.contract = mapFileArray("signedContract");
	result.guarantor_0_doc = mapFileArray("guarantor_0_doc");
	result.guarantor_1_doc = mapFileArray("guarantor_1_doc");
	result.guarantor_2_doc = mapFileArray("guarantor_2_doc");

	return result;
}

/**
 * Transform API customer response to InstallmentPaymentForm structure
 */
export function transformCustomerToInstallmentForm(customer: unknown): InstallmentPaymentForm {
	const empty: InstallmentPaymentForm = {
		fullName: "",
		email: "",
		whatsapp: "",
		dob: "",
		address: "",
		isDriver: undefined,
		nextOfKin: { fullName: "", phone: "", relationship: "", spouseName: "", spousePhone: "", address: "" },
		propertyId: "",
		propertyName: "",
		isCustomProperty: false,
		customPropertyPrice: "",
		paymentFrequency: "",
		paymentDuration: "",
		paymentDurationUnit: "",
		downPayment: "",
		amountAvailable: "",
		clarification: { previousAgreement: null, completedAgreement: null, prevCompany: "", reason: "" },
		employment: { status: "", employerName: "", employerAddress: "", companyName: "", businessAddress: "", homeAddress: "" },
		guarantors: [],
	};

	if (!customer || typeof customer !== "object") return empty;

	const c = customer as Record<string, unknown>;

	const firstInterest =
		Array.isArray(c.propertyInterestRequest) && c.propertyInterestRequest.length > 0
			? (c.propertyInterestRequest[0] as Record<string, unknown>)
			: undefined;

	const guarantorsArray = Array.isArray(c.guarantors) ? (c.guarantors as unknown[]) : [];

	return {
		fullName: (c.fullName || c.name || "") as string,
		email: (c.email || "") as string,
		whatsapp: (c.phoneNumber || c.phone || "") as string,
		dob: (c.dateOfBirth || "") as string,
		address: (c.homeAddress || (c.employmentDetails && (c.employmentDetails as Record<string, unknown>).homeAddress) || c.address || "") as string,
		isDriver: c.isDriver === "Yes" || c.isDriver === true ? true : c.isDriver === "No" || c.isDriver === false ? false : undefined,
		nextOfKin: {
			fullName: ((c.nextOfKin && (c.nextOfKin as Record<string, unknown>).fullName) || "") as string,
			phone: ((c.nextOfKin && ((c.nextOfKin as Record<string, unknown>).phoneNumber || (c.nextOfKin as Record<string, unknown>).phone)) ||
				"") as string,
			relationship: ((c.nextOfKin && (c.nextOfKin as Record<string, unknown>).relationship) || "") as string,
			spouseName: ((c.nextOfKin &&
				((c.nextOfKin as Record<string, unknown>).spouseFullName || (c.nextOfKin as Record<string, unknown>).spouseName)) ||
				"") as string,
			spousePhone: ((c.nextOfKin && (c.nextOfKin as Record<string, unknown>).spousePhone) || "") as string,
			address: ((c.nextOfKin && ((c.nextOfKin as Record<string, unknown>).spouseAddress || (c.nextOfKin as Record<string, unknown>).address)) ||
				"") as string,
		},
		propertyName: (firstInterest && (firstInterest.customPropertyName as string)) || "",
		propertyId: (firstInterest && (firstInterest.propertyId as string)) || "",
		isCustomProperty: Boolean(firstInterest && (firstInterest.isCustomProperty as boolean)),
		customPropertyPrice: String((firstInterest && (firstInterest.customPropertyPrice as number)) || ""),
		paymentFrequency: String((firstInterest && firstInterest.paymentIntervalId) || ""),
		paymentDuration: String((firstInterest && firstInterest.durationValue) || ""),
		paymentDurationUnit: String((firstInterest && firstInterest.durationUnitId) || ""),
		downPayment: String((firstInterest && firstInterest.downPayment) || (c.downPayment as string) || ""),
		amountAvailable: firstInterest && firstInterest.downPayment ? String(firstInterest.downPayment) : "",
		clarification: {
			previousAgreement: c.previousHirePurchase === "Yes" ? true : c.previousHirePurchase === "No" ? false : null,
			completedAgreement: c.wasPreviousCompleted === "Yes" ? true : c.wasPreviousCompleted === "No" ? false : null,
			prevCompany: (c.previousCompany || "") as string,
			reason: (c.purposeOfProperty || "") as string,
		},
		employment: {
			status: String((c.employmentDetails && (c.employmentDetails as Record<string, unknown>).employmentStatusId) || ""),
			employerName: String((c.employmentDetails && (c.employmentDetails as Record<string, unknown>).employerName) || ""),
			employerAddress: String((c.employmentDetails && (c.employmentDetails as Record<string, unknown>).employerAddress) || ""),
			companyName: String((c.employmentDetails && (c.employmentDetails as Record<string, unknown>).companyName) || ""),
			businessAddress: String((c.employmentDetails && (c.employmentDetails as Record<string, unknown>).businessAddress) || ""),
			homeAddress: String((c.employmentDetails && (c.employmentDetails as Record<string, unknown>).homeAddress) || ""),
		},
		guarantors: guarantorsArray.map((g) => {
			const gg = g && typeof g === "object" ? (g as Record<string, unknown>) : {};
			return {
				fullName: (gg.fullName || "") as string,
				occupation: (gg.occupation || "") as string,
				phone: (gg.phoneNumber || gg.phone || "") as string,
				email: (gg.email || "") as string,
				employmentStatus: String(gg.employmentStatusId || ""),
				homeAddress: (gg.homeAddress || gg.address || "") as string,
				businessAddress: (gg.companyAddress || gg.businessAddress || "") as string,
				stateOfOrigin: String(gg.stateOfOrigin || ""),
				votersUploaded: (gg.votersUploaded as number) || 0,
			};
		}),
	};
}

/**
 * Transform API customer response to OncePaymentForm structure
 */
export function transformCustomerToOnceForm(customer: unknown): OncePaymentForm {
	const empty: OncePaymentForm = { fullName: "", email: "", whatsapp: "", numberOfProperties: "0", properties: [] };
	if (!customer || typeof customer !== "object") return empty;

	const c = customer as Record<string, unknown>;
	const propsArr = Array.isArray(c.propertyInterestRequest) ? (c.propertyInterestRequest as unknown[]) : [];

	return {
		fullName: (c.fullName || c.name || "") as string,
		email: (c.email || "") as string,
		whatsapp: (c.phoneNumber || c.phone || "") as string,
		numberOfProperties: String(propsArr.length || 0),
		properties: propsArr.map((prop) => {
			const p = prop && typeof prop === "object" ? (prop as Record<string, unknown>) : {};
			return { propertyName: (p.customPropertyName || "") as string, quantity: (p.quantity as number) || 1 };
		}),
	};
}

/**
 * Determine which payment method the customer used
 */
export function getCustomerPaymentMethod(customer: unknown): "once" | "installment" | undefined {
	if (!customer || typeof customer !== "object") return undefined;
	const c = customer as Record<string, unknown>;

	// Reference: 1 = Hire Purchase (installment), 2 = Full Payment (once)
	const explicitId = (() => {
		if (typeof c.paymentTypeId === "number") return c.paymentTypeId as number;
		if (typeof c.paymentTypeId === "string" && /^\d+$/.test(c.paymentTypeId)) return Number(c.paymentTypeId);
		if (c.paymentType && typeof c.paymentType === "object") {
			const pt = c.paymentType as Record<string, unknown>;
			if (typeof pt.id === "number") return pt.id;
			if (typeof pt.id === "string" && /^\d+$/.test(pt.id)) return Number(pt.id);
			if (typeof pt.type === "string") {
				if (pt.type.toLowerCase().includes("full")) return 2;
				if (pt.type.toLowerCase().includes("hire") || pt.type.toLowerCase().includes("install")) return 1;
			}
		}
		return undefined;
	})();

	if (explicitId === 1) return "installment";
	if (explicitId === 2) return "once";

	if (Array.isArray(c.propertyInterestRequest) && c.propertyInterestRequest.length > 0) {
		const first = c.propertyInterestRequest[0] as Record<string, unknown> | undefined;
		if (first) {
			if (first.paymentInterval || first.durationValue || first.durationUnit) return "installment";
			if (first.isCustomProperty || first.customPropertyPrice || first.customPropertyName) return "once";
		}
		return "installment";
	}

	if (Array.isArray(c.properties) && c.properties.length > 0) return "once";

	return "installment";
}
