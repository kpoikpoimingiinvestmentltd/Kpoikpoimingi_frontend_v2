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
			toast.success(`Registration updated successfully!`);
		},
		(err) => {
			console.error("Error updating customer registration:", err);
			toast.error("Failed to update registration");
		}
	);

	// Reference data for dropdowns
	const { data: refData, isLoading: refLoading } = useGetReferenceData();

	const relationshipOptions = React.useMemo(() => extractRelationshipOptions(refData), [refData]);
	const paymentFrequencyOptions = React.useMemo(() => extractPaymentFrequencyOptions(refData), [refData]);
	const durationUnitOptions = React.useMemo(() => extractDurationUnitOptions(refData), [refData]);
	const employmentStatusOptions = React.useMemo(() => extractEmploymentStatusOptions(refData), [refData]);
	const stateOfOriginOptions = React.useMemo(() => extractStateOptions(refData), [refData]);

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
					paymentTypeId: 1, // Assuming 1 = full payment
					properties: onceForm.properties.map((prop) => ({
						propertyId: prop.propertyName,
						quantity: prop.quantity,
						isCustomProperty: true,
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
					paymentTypeId: 2, // Assuming 2 = installment
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
					await updateMutation.mutateAsync({
						id: initial.id,
						payload,
					});
				} else {
					const response = await createInternalCustomerRegistration(payload);
					toast.success(`Registration created successfully! Code: ${response.registrationCode}`);
				}

				// Reset form completely (localStorage + state)
				resetFormCompletely();

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
		/>
	);
}
