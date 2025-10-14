import { z } from "zod";

// Login DTO
export const LoginDto = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(1, { message: "Password is required" }),
});

// Refresh token DTO
export const RefreshTokenDto = z.object({
	refreshToken: z.string().min(1, { message: "Refresh token is required" }),
});

// Pagination DTO (used for list endpoints)
export const PaginationDto = z.object({
	page: z.number().int().nonnegative().optional().default(1),
	limit: z.number().int().positive().optional().default(10),
	search: z.string().optional(),
	sortBy: z.enum(["name", "price", "createdAt", "updatedAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Next-of-kin creation DTO
export const CreateNextOfKinDto = z.object({
	fullName: z.string().min(1),
	relationship: z.string().min(1),
	phoneNumber: z.string().min(1),
	spouseFullName: z.string().optional(),
	spousePhone: z.string().optional(),
	spouseAddress: z.string().optional(),
	isNextOfKinSpouse: z.boolean().optional(),
});

// Guarantor creation DTO (fields based on screenshot - many optional)
export const CreateGuarantorDto = z.object({
	fullName: z.string().min(1),
	occupation: z.string().optional(),
	employmentStatusId: z.number().optional(),
	address: z.string().optional(),
	stateOfOrigin: z.string().optional(),
	phoneNumber: z.string().optional(),
	companyAddress: z.string().optional(),
	homeAddress: z.string().optional(),
	email: z.string().email().optional(),
	guarantorAgreement: z.boolean().optional(),
	guarantorAgreementAt: z.string().optional(),
});

// Employment details
export const CreateEmploymentDetailsDto = z.object({
	employmentStatusId: z.union([z.string(), z.number()]).optional(),
	employerName: z.string().optional(),
	employerAddress: z.string().optional(),
	companyName: z.string().optional(),
	businessAddress: z.string().optional(),
	homeAddress: z.string().optional(),
});

// Property interest request
export const PropertyQuantityDto = z
	.object({
		propertyId: z.string().nullable().optional(),
		quantity: z.number().int().min(1),
		isCustomProperty: z.boolean().default(false),
		customPropertyName: z.string().nullable().optional(),
		customPropertyPrice: z.number().nullable().optional(),
	})
	.superRefine((val, ctx) => {
		if (val.isCustomProperty) {
			if (!val.customPropertyName)
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "customPropertyName is required when isCustomProperty=true",
					path: ["customPropertyName"],
				});
			if (val.customPropertyPrice == null)
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "customPropertyPrice is required when isCustomProperty=true",
					path: ["customPropertyPrice"],
				});
		} else {
			// when not custom, propertyId is required
			if (!val.propertyId)
				ctx.addIssue({ code: z.ZodIssueCode.custom, message: "propertyId is required when isCustomProperty=false", path: ["propertyId"] });
		}
	});

export const CreatePropertyInterestRequestDto = z.object({
	propertyId: z.union([z.string(), z.number()]).optional(),
	paymentIntervalId: z.union([z.string(), z.number()]).optional(),
	durationValue: z.number().optional(),
	durationUnitId: z.union([z.string(), z.number()]).optional(),
	downPayment: z.number().optional(),
	quantity: z.number().optional(),
	isAssigned: z.boolean().optional(),
	isCustomProperty: z.boolean().optional(),
	customPropertyName: z.string().optional(),
	customPropertyPrice: z.number().optional(),
	properties: z.array(PropertyQuantityDto).optional(),
});

// Media keys container
export const MediaKeysDto = z.object({
	identificationDocument: z.array(z.string()).optional(),
	indegeneCertificate: z.array(z.string()).optional(),
	driverLicense: z.array(z.string()).optional(),
	guarantor_0_doc: z.array(z.string()).optional(),
	guarantor_1_doc: z.array(z.string()).optional(),
	other: z.array(z.string()).optional(),
});

// Customer DTOs
export const CreateCustomerDto = z.object({
	fullName: z.string().min(1),
	email: z.string().email(),
	homeAddress: z.string().min(1),
	phoneNumber: z.string().min(1),
	paymentTypeId: z.number(),
	isDriver: z.boolean().optional(),
	requestAgreement: z.boolean().optional(),
	requestAgreementAt: z.string().optional(),
	dateOfBirth: z.string().optional(),
	purposeOfProperty: z.string().optional(),
	downPayment: z.number().optional(),
	previousHirePurchase: z.boolean().optional(),
	previousCompany: z.string().optional(),
	wasPreviousCompleted: z.boolean().optional(),
	nextOfKin: z.array(CreateNextOfKinDto).optional(),
	guarantors: z.array(CreateGuarantorDto).optional(),
	employmentDetails: CreateEmploymentDetailsDto.optional(),
	propertyInterestRequest: z.array(CreatePropertyInterestRequestDto).optional(),
	mediaKeys: MediaKeysDto.optional(),
});

// Internal customer DTO: same shape but require some internal-only required fields
export const CreateCustomerInternalDto = CreateCustomerDto.merge(
	z.object({
		email: z.string().email(),
		homeAddress: z.string(),
		paymentTypeId: z.number(),
	})
);

// Full payment DTO (for buying properties)
export const PropertyQuantitySimpleDto = z.object({
	propertyId: z.union([z.string(), z.number()]),
	quantity: z.number().int().positive().optional(),
});

export const CreateFullPaymentDto = z.object({
	fullName: z.string().min(1),
	email: z.string().email(),
	paymentTypeId: z.number(),
	phoneNumber: z.string().min(1),
	properties: z.array(PropertyQuantitySimpleDto).min(1),
});

// Settings updates
export const UpdateVATDto = z.object({
	percentage: z.number().min(0).max(1),
});

export const UpdateInterestDto = z.object({
	interestRate: z.number().min(0).max(1),
});

export const UpdatePenaltyInterestDto = z.object({
	interestRate: z.number().min(0).max(1),
});

// Generate Receipt DTO
export const GenerateReceiptDto = z.object({
	contractId: z.string().min(1),
	customerId: z.string().min(1),
	amount: z.preprocess((val) => {
		if (typeof val === "string") return val.trim() === "" ? NaN : Number(val);
		return val;
	}, z.number().min(0)),
	paymentMethodId: z.union([z.string(), z.number()]).optional(),
	paymentDate: z.string().optional(),
	vat: z.union([z.string(), z.number()]).optional(),
	interest: z.union([z.string(), z.number()]).optional(),
	propertyName: z.string().optional(),
	reference: z.string().optional(),
	notes: z.string().optional(),
	paymentScheduleId: z.string().optional(),
	source: z.string().optional(),
});

// Category DTOs
export const SubCategoryDto = z.object({
	name: z.string().min(1),
});

export const CreateCategoryDto = z.object({
	category: z.string().min(1),
	description: z.string().optional(),
	subcategories: z.array(SubCategoryDto).optional(),
});

export const UpdateCategoryDto = CreateCategoryDto;
