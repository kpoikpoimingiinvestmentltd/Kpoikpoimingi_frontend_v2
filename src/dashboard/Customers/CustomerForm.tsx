import React from "react";
import { useGetReferenceData } from "@/api/reference";
import { twMerge } from "tailwind-merge";
import { usePresignUploadMutation } from "@/api/presign-upload.api";
import { uploadFileToPresignedUrl } from "@/utils/media-upload";
import { createInternalCustomerRegistration, useUpdateCustomerRegistration } from "@/api/customer-registration";
import { useCreateInternalFullPaymentRegistration } from "@/api/contracts";
import { formatPhoneNumber, extractErrorMessage } from "@/lib/utils";
import { toast } from "sonner";

import { useCustomerFormState } from "./hooks/useCustomerFormState";
import OncePaymentForm from "./forms/OncePaymentForm";
import InstallmentPaymentForm from "./forms/InstallmentPaymentForm";
import { getCustomerPaymentMethod } from "./helpers/transformCustomerToForm";
import type { CustomerRegistrationPayload } from "@/types/customerRegistration";
import type { OncePaymentForm as OncePaymentFormType, InstallmentPaymentForm as InstallmentPaymentFormType } from "@/types/customerRegistration";
import {
	extractRelationshipOptions,
	extractPaymentFrequencyOptions,
	extractDurationUnitOptions,
	extractEmploymentStatusOptions,
	extractStateOptions,
} from "@/lib/referenceDataHelpers";
import { useNavigate } from "react-router";
import { _router } from "@/routes/_router";

type Props = {
	onSubmit?: (data: unknown) => void;
	initial?: any;
	sectionTitle?: (additionalClasses?: string) => string;
	centeredContainer?: (additionalClasses?: string) => string;
	paymentMethod?: "once" | "installment";
};

export default function CustomerForm({
	onSubmit,
	initial,
	sectionTitle: sectionTitleProp,
	centeredContainer: centeredContainerProp,
	paymentMethod: paymentMethodProp,
}: Props) {
	const baseEachSectionTitle = "text-lg font-normal";
	const baseCenteredContainer = "mx-auto w-full md:w-2/3 w-full my-12";

	const sectionTitle = sectionTitleProp || ((additionalClasses?: string) => twMerge(baseEachSectionTitle, additionalClasses));
	const centeredContainer = centeredContainerProp || ((additionalClasses?: string) => twMerge(baseCenteredContainer, additionalClasses));

	// Determine if we're in edit mode and which payment method to use
	const isEditMode = !!initial?.id;
	const detectedPaymentMethod = isEditMode ? getCustomerPaymentMethod(initial) : paymentMethodProp;
	const paymentMethod = detectedPaymentMethod || paymentMethodProp;

	// Form state
	const { form, handleChange, uploadedFiles, setUploadedFiles, uploadedFieldsRef, resetFormCompletely } = useCustomerFormState(
		paymentMethod,
		initial
	);

	// Navigation helper
	const navigate = useNavigate();

	// API hooks
	const [presignUpload] = usePresignUploadMutation();
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	// Full payment registration mutation
	const fullPaymentMutation = useCreateInternalFullPaymentRegistration(
		() => {
			toast.success(`Registration created successfully!`);
		},
		(err) => {
			console.error("Error creating full payment registration:", err);
			toast.error("Failed to create full payment registration");
		}
	);

	const updateMutation = useUpdateCustomerRegistration(
		() => {
			// no success toast here; parent will handle UI update
		},
		(err) => {
			console.error("Error updating customer registration:", err);
			toast.error("Failed to update registration");
		}
	);

	// Reference data for dropdowns
	const { data: refData, isLoading: refLoading } = useGetReferenceData();

	const didPrefillRef = React.useRef(false);

	React.useEffect(() => {
		if (didPrefillRef.current) return;
		if (!initial) return;
		if (paymentMethod !== "installment") return;
		const toLocalPhone = (phone?: string | null) => {
			if (!phone) return "";
			const cleaned = String(phone).replace(/\D/g, "");
			if (cleaned.startsWith("234")) return `0${cleaned.slice(3)}`;
			if (cleaned.startsWith("0")) return cleaned;
			if (cleaned.length === 10) return `0${cleaned}`;
			return cleaned;
		};

		try {
			const phoneVal = (initial as any)?.phoneNumber ?? (initial as any)?.phone;
			handleChange("whatsapp", toLocalPhone(typeof phoneVal === "string" ? phoneVal : ""));
		} catch {
			// ignore
		}

		// Also normalize nextOfKin phones if present
		try {
			const nk = (initial as any)?.nextOfKin;
			if (nk && typeof nk === "object") {
				const nkPhoneVal = nk.phoneNumber ?? nk.phone ?? "";
				const nkSpouseVal = nk.spousePhone ?? "";
				const currNext = (form as InstallmentPaymentFormType).nextOfKin || {};
				handleChange("nextOfKin", {
					...currNext,
					phone: toLocalPhone(typeof nkPhoneVal === "string" ? nkPhoneVal : ""),
					spousePhone: toLocalPhone(typeof nkSpouseVal === "string" ? nkSpouseVal : ""),
				});
			}
		} catch {
			// ignore
		}

		// Normalize guarantor phones if present
		try {
			const gArr = (initial as any)?.guarantors;
			if (Array.isArray(gArr)) {
				// Ensure we always have two guarantor slots in edit mode
				const existing = (form as InstallmentPaymentFormType).guarantors || [];
				const mapped = [0, 1].map((i) => {
					const src = gArr[i] || {};
					const curr = existing[i] || {
						fullName: "",
						occupation: "",
						phone: "",
						email: "",
						employmentStatus: "",
						homeAddress: "",
						businessAddress: "",
						stateOfOrigin: "",
						votersUploaded: 0,
					};
					return {
						...curr,
						fullName: src.fullName ?? curr.fullName,
						occupation: src.occupation ?? curr.occupation,
						phone: toLocalPhone(String(src.phoneNumber ?? src.phone ?? curr.phone ?? "")),
						email: src.email ?? curr.email,
						employmentStatus: String(src.employmentStatus ?? curr.employmentStatus ?? ""),
						homeAddress: src.homeAddress ?? curr.homeAddress,
						businessAddress: src.businessAddress ?? curr.businessAddress,
						stateOfOrigin: src.stateOfOrigin ?? curr.stateOfOrigin,
						votersUploaded: curr.votersUploaded ?? 0,
					};
				});
				handleChange("guarantors", mapped);
			}
		} catch {
			// ignore
		}

		didPrefillRef.current = true;
	}, [initial, paymentMethod, handleChange]);

	const relationshipOptions = React.useMemo(() => extractRelationshipOptions(refData), [refData]);
	const paymentFrequencyOptions = React.useMemo(() => extractPaymentFrequencyOptions(refData), [refData]);
	const durationUnitOptions = React.useMemo(() => extractDurationUnitOptions(refData), [refData]);
	const employmentStatusOptions = React.useMemo(() => extractEmploymentStatusOptions(refData), [refData]);
	const stateOfOriginOptions = React.useMemo(() => extractStateOptions(refData), [refData]);

	// Ensure guarantor.stateOfOrigin uses option keys (not names) once ref data is available
	React.useEffect(() => {
		if (refLoading) return;
		try {
			const gArr = (form as InstallmentPaymentFormType).guarantors || [];
			const mapped = gArr.map((g) => {
				if (!g || !g.stateOfOrigin) return g;
				// If already an option key, keep
				if (stateOfOriginOptions.find((o) => o.key === g.stateOfOrigin)) return g;
				// Try to match by option value (case-insensitive)
				const found = stateOfOriginOptions.find((o) => o.value.toLowerCase() === String(g.stateOfOrigin).toLowerCase());
				if (found) return { ...g, stateOfOrigin: found.key };
				return g;
			});
			const prev = JSON.stringify(gArr || []);
			const next = JSON.stringify(mapped || []);
			if (prev !== next) handleChange("guarantors", mapped);
		} catch {
			// ignore
		}
	}, [refLoading, stateOfOriginOptions, handleChange]);

	// Normalize guarantor phone numbers to local editable format (e.g., +234... -> 0...)
	React.useEffect(() => {
		if (paymentMethod !== "installment") return;
		try {
			const toLocalPhone = (phone?: string | null) => {
				if (!phone) return "";
				const cleaned = String(phone).replace(/\D/g, "");
				if (cleaned.startsWith("234")) return `0${cleaned.slice(3)}`;
				if (cleaned.startsWith("0")) return cleaned;
				if (cleaned.length === 10) return `0${cleaned}`;
				return cleaned;
			};

			const gArr = (form as InstallmentPaymentFormType).guarantors || [];
			const mapped = gArr.map((g) => {
				const current = g || ({} as any);
				const rawPhone = (current.phone ?? (current as any).phoneNumber ?? "") as string;
				const normalized = toLocalPhone(rawPhone);
				if (normalized !== (current.phone ?? "")) {
					return { ...current, phone: normalized };
				}
				return current;
			});
			const prev = JSON.stringify(gArr || []);
			const next = JSON.stringify(mapped || []);
			if (prev !== next) handleChange("guarantors", mapped);
		} catch {
			// ignore
		}
	}, [form, paymentMethod, handleChange]);

	/**
	 * Get state name from state ID using stateOfOriginOptions
	 */
	const getStateNameById = (stateId: string): string => {
		if (!stateId) return "";
		const state = stateOfOriginOptions.find((o) => o.key === stateId);
		return state?.value || stateId;
	};

	/**
	 * Handle file upload for media documents
	 */
	async function handleFileUpload(file: File, fieldKey: string): Promise<string | null> {
		if (!file) return null;

		try {
			// Step 1: Get presigned URL
			const presignResult = await presignUpload({
				filename: file.name,
				contentType: file.type,
				relatedTable: "customer",
			}).unwrap();

			const uploadUrl = presignResult.url ?? presignResult.uploadUrl;
			if (!uploadUrl) {
				throw new Error("Presign upload did not return an uploadUrl");
			}

			// Step 2: Upload file to presigned URL
			const uploadResult = await uploadFileToPresignedUrl(uploadUrl, file);
			if (!uploadResult.success) {
				throw new Error(uploadResult.error ?? "Upload failed");
			}

			// Step 3: Get the media key
			let mediaKey: string | undefined;
			if (typeof presignResult.key === "string") mediaKey = presignResult.key;
			else if (presignResult && typeof presignResult === "object") {
				const pr = presignResult as Record<string, unknown>;
				if (pr.data && typeof pr.data === "object") {
					const dataObj = pr.data as Record<string, unknown>;
					if (typeof dataObj.key === "string") mediaKey = dataObj.key;
				}
			}

			if (mediaKey) {
				// Track uploaded file
				setUploadedFiles((prev) => ({
					...prev,
					[fieldKey]: [...(prev[fieldKey] ?? []), mediaKey],
				}));

				// Mark field as uploaded
				uploadedFieldsRef.current.add(fieldKey);

				return mediaKey;
			}

			return null;
		} catch (err: unknown) {
			console.error(`File upload failed for ${fieldKey}:`, err);
			toast.error(`Upload failed: ${extractErrorMessage(err, "Unknown error")}`);
			return null;
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (paymentMethod === "once") {
				// For full payment - create internal full payment registration
				const onceForm = form as OncePaymentFormType;

				// Convert OncePaymentForm to FullPaymentRegistrationPayload
				const fullPaymentPayload = {
					fullName: onceForm.fullName,
					email: onceForm.email,
					phoneNumber: formatPhoneNumber(onceForm.whatsapp),
					paymentTypeId: 2, // Full Payment
					properties: onceForm.properties.map((prop) => ({
						propertyId: prop.propertyId && String(prop.propertyId).trim() ? prop.propertyId : prop.propertyName,
						quantity: Number(prop.quantity) || 0,
						isCustomProperty: !!prop.isCustomProperty || !prop.propertyId,
					})),
				};

				// Submit or update full payment registration
				if (isEditMode) {
					const initObj = initial && typeof initial === "object" ? (initial as Record<string, unknown>) : undefined;
					const initId = initObj && typeof initObj.id === "string" ? initObj.id : "";
					await updateMutation.mutateAsync({
						id: initId,
						payload: fullPaymentPayload as unknown as CustomerRegistrationPayload,
					});
				} else {
					await fullPaymentMutation.mutateAsync(fullPaymentPayload);
				}

				// Reset form completely (localStorage + state)
				resetFormCompletely();
				// After successful creation, navigate back to customers list (non-edit)
				if (!isEditMode) navigate(_router.dashboard.customers);

				// Call parent onSubmit if provided
				if (onSubmit) {
					onSubmit({ ...fullPaymentPayload, message: "Registration saved successfully" });
				}
			} else {
				// For installment - create internal registration
				const installmentForm = form as InstallmentPaymentFormType;

				// Build the customer registration payload
				const payload: CustomerRegistrationPayload = {
					fullName: installmentForm.fullName,
					email: installmentForm.email,
					homeAddress: installmentForm.address,
					phoneNumber: formatPhoneNumber(installmentForm.whatsapp),
					paymentTypeId: 1, // Hire Purchase
					isDriver: installmentForm.isDriver ? "Yes" : "No",
					requestAgreement: "I hereby request to be a customer of the company",
					requestAgreementAt: new Date().toISOString(),
					dateOfBirth: installmentForm.dob,
					purposeOfProperty: installmentForm.clarification.reason,
					downPayment: Number(installmentForm.downPayment) || 0,
					previousHirePurchase:
						installmentForm.clarification.previousAgreement === true ? "Yes" : installmentForm.clarification.previousAgreement === false ? "No" : "",
					previousCompany: installmentForm.clarification.previousAgreement === true ? installmentForm.clarification.prevCompany || "" : "",
					...(installmentForm.clarification.previousAgreement === true && {
						wasPreviousCompleted: installmentForm.clarification.completedAgreement === true ? "Yes" : "No",
					}),
					nextOfKin: {
						fullName: installmentForm.nextOfKin.fullName,
						relationship: installmentForm.nextOfKin.relationship,
						phoneNumber: formatPhoneNumber(installmentForm.nextOfKin.phone),
						spouseFullName: installmentForm.nextOfKin.spouseName,
						spousePhone: formatPhoneNumber(installmentForm.nextOfKin.spousePhone),
						spouseAddress: installmentForm.nextOfKin.address,
						isNextOfKinSpouse: installmentForm.nextOfKin.spouseName ? "Yes" : "No",
					},
					guarantors: installmentForm.guarantors.map((g, idx) => ({
						fullName: g.fullName,
						occupation: g.occupation,
						employmentStatusId: Number(g.employmentStatus) || 0,
						address: g.homeAddress,
						stateOfOrigin: getStateNameById(g.stateOfOrigin),
						phoneNumber: formatPhoneNumber(g.phone),
						companyAddress: g.businessAddress,
						homeAddress: g.homeAddress,
						email: g.email,
						guarantorAgreement: "I agree to be a guarantor",
						guarantorAgreementAt: new Date().toISOString(),
						identityDocument: uploadedFiles[`guarantor_${idx}_doc`] || [],
					})),
					employmentDetails: {
						employmentStatusId: Number(installmentForm.employment.status) || 0,
						employerName: installmentForm.employment.employerName,
						employerAddress: installmentForm.employment.employerAddress,
						companyName: installmentForm.employment.companyName,
						businessAddress: installmentForm.employment.businessAddress,
						homeAddress: installmentForm.employment.homeAddress,
					},
					propertyInterestRequest: [
						{
							...(installmentForm.isCustomProperty
								? {
										customPropertyName: installmentForm.propertyName,
										customPropertyPrice: Number(installmentForm.customPropertyPrice) || 0,
										isCustomProperty: true,
								  }
								: {
										propertyId: installmentForm.propertyId,
										isCustomProperty: false,
								  }),
							paymentIntervalId: Number(installmentForm.paymentFrequency) || 0,
							durationValue: Number(installmentForm.paymentDuration) || 0,
							durationUnitId: Number(installmentForm.paymentDurationUnit) || 2,
							downPayment: Number(installmentForm.downPayment) || 0,
							quantity: 1,
						},
					],
					mediaKeys: {
						...(uploadedFiles.nin && { identificationDocument: uploadedFiles.nin }),
						...(uploadedFiles.driverLicense && { driverLicense: uploadedFiles.driverLicense }),
						...(uploadedFiles.indigeneCertificate && { indegeneCertificate: uploadedFiles.indigeneCertificate }),
						...(uploadedFiles.guarantor_0_doc && { guarantor_0_doc: uploadedFiles.guarantor_0_doc }),
						...(uploadedFiles.guarantor_1_doc && { guarantor_1_doc: uploadedFiles.guarantor_1_doc }),
						...(uploadedFiles.contract && { signedContract: uploadedFiles.contract }),
					},
				};

				// Submit or update registration
				if (isEditMode) {
					// Enforce two guarantors for installment/edit when required
					if (paymentMethod === "installment") {
						const gCount = Array.isArray((form as InstallmentPaymentFormType).guarantors)
							? (form as InstallmentPaymentFormType).guarantors.length
							: 0;
						if (gCount < 2) {
							toast.error("Please provide two guarantors before saving");
							setIsSubmitting(false);
							return;
						}
						// Require duration value before saving
						const dur = Number((form as InstallmentPaymentFormType).paymentDuration || 0);
						if (!dur || dur <= 0) {
							toast.error("Duration value is required for hire purchase");
							setIsSubmitting(false);
							return;
						}
						// Require stateOfOrigin for guarantors
						{
							const missingIdx = ((form as InstallmentPaymentFormType).guarantors || []).findIndex(
								(g) => !g || !g.stateOfOrigin || String(g.stateOfOrigin).trim() === ""
							);
							if (missingIdx >= 0) {
								toast.error(`Guarantor ${missingIdx + 1}: State of origin is required`);
								setIsSubmitting(false);
								return;
							}
						}
					}
					const result = await updateMutation.mutateAsync({
						id: initial.id,
						payload,
					});

					if (onSubmit) onSubmit(result);
				} else {
					// For new registrations still enforce guarantor count for installment
					if (paymentMethod === "installment") {
						const gCount = Array.isArray((form as InstallmentPaymentFormType).guarantors)
							? (form as InstallmentPaymentFormType).guarantors.length
							: 0;
						if (gCount < 2) {
							toast.error("Please provide two guarantors before saving");
							setIsSubmitting(false);
							return;
						}
						const dur = Number((form as InstallmentPaymentFormType).paymentDuration || 0);
						if (!dur || dur <= 0) {
							toast.error("Duration value is required for hire purchase");
							setIsSubmitting(false);
							return;
						}
						// Require stateOfOrigin for guarantors
						{
							const missingIdx = ((form as InstallmentPaymentFormType).guarantors || []).findIndex(
								(g) => !g || !g.stateOfOrigin || String(g.stateOfOrigin).trim() === ""
							);
							if (missingIdx >= 0) {
								toast.error(`Guarantor ${missingIdx + 1}: State of origin is required`);
								setIsSubmitting(false);
								return;
							}
						}
					}
					const response = await createInternalCustomerRegistration(payload);
					toast.success(`Registration created successfully! Code: ${response.registrationCode}`);
				}

				resetFormCompletely();
				if (!isEditMode) navigate(_router.dashboard.customers);

				// Call parent onSubmit if provided
				if (onSubmit) {
					onSubmit({ message: "Registration saved successfully" });
				}
			}
		} catch (err: unknown) {
			console.error("Submission failed", err);
			toast.error(`Submission failed: ${extractErrorMessage(err, "Unknown error")}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Validation helpers
	const isOnceValid = () => {
		if (paymentMethod !== "once") return true;
		const f = form as OncePaymentFormType;
		if (!f.fullName || !f.email || !f.whatsapp || !f.numberOfProperties) return false;
		for (const p of f.properties) {
			if (!p.propertyName || !p.quantity || Number(p.quantity) < 1) return false;
		}
		return true;
	};

	// When ref data loads, set defaults
	React.useEffect(() => {
		if (refLoading) return;
	}, [refLoading, relationshipOptions, paymentFrequencyOptions, durationUnitOptions, employmentStatusOptions, stateOfOriginOptions]);

	const onceValid = isOnceValid();

	// Render Once Payment Form
	if (paymentMethod === "once") {
		return (
			<OncePaymentForm
				form={form as OncePaymentFormType}
				handleChange={handleChange}
				isSubmitting={isSubmitting}
				onSubmit={handleSubmit}
				centeredContainer={centeredContainer}
				sectionTitle={sectionTitle}
				isValid={onceValid}
			/>
		);
	}

	// Render Installment Payment Form
	const missingFields: string[] = React.useMemo(() => {
		if (paymentMethod !== "installment") return [];
		const f = form as InstallmentPaymentFormType;
		const miss: string[] = [];
		// Require two guarantors when applicable
		if (!Array.isArray(f.guarantors) || f.guarantors.length < 2) {
			miss.push("Two guarantors required");
		}
		// Require duration value for hire purchase
		if (!f.paymentDuration || Number(f.paymentDuration) <= 0) {
			miss.push("Duration value is required for hire purchase");
		}
		// Require stateOfOrigin for each guarantor
		if (Array.isArray(f.guarantors)) {
			f.guarantors.forEach((g, idx) => {
				if (!g || !g.stateOfOrigin || String(g.stateOfOrigin).trim() === "") {
					miss.push(`Guarantor ${idx + 1}: State of origin is required`);
				}
			});
		}
		return miss;
	}, [form, paymentMethod]);

	return (
		<InstallmentPaymentForm
			form={form as InstallmentPaymentFormType}
			handleChange={handleChange}
			isSubmitting={isSubmitting}
			onSubmit={handleSubmit}
			uploadedFiles={uploadedFiles}
			uploadedFieldsRef={uploadedFieldsRef}
			handleFileUpload={handleFileUpload}
			relationshipOptions={relationshipOptions}
			paymentFrequencyOptions={paymentFrequencyOptions}
			durationUnitOptions={durationUnitOptions}
			employmentStatusOptions={employmentStatusOptions}
			stateOfOriginOptions={stateOfOriginOptions}
			refLoading={refLoading}
			paymentMethod={paymentMethod}
			centeredContainer={centeredContainer}
			sectionTitle={sectionTitle}
			setUploadedFiles={setUploadedFiles}
			missingFields={missingFields}
		/>
	);
}
