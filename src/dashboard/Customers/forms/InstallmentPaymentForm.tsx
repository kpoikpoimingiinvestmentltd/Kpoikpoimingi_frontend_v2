import React from "react";
import { Spinner } from "@/components/ui/spinner";
import ActionButton from "@/components/base/ActionButton";
import CheckboxField from "@/components/base/CheckboxField";
import PersonalDetailsSection from "../sections/PersonalDetailsSection";
import IndigeneCertificateSection from "../sections/IndigeneCertificateSection";
import IdentificationDocumentSection from "../sections/IdentificationDocumentSection";
import NextOfKinSection from "../sections/NextOfKinSection";
import EmploymentDetailsSection from "../sections/EmploymentDetailsSection";
import PropertyDetailsSection from "../sections/PropertyDetailsSection";
import ClarificationDetailsSection from "../sections/ClarificationDetailsSection";
import GuarantorSection from "../sections/GuarantorSection";
import type { InstallmentPaymentForm, FileUploadState } from "@/types/customerRegistration";

type Props = {
	form: InstallmentPaymentForm;
	handleChange: (key: string, value: any) => void;
	isSubmitting: boolean;
	onSubmit: (e: React.FormEvent) => void;
	uploadedFiles: FileUploadState;
	uploadedFieldsRef: React.MutableRefObject<Set<string>>;
	handleFileUpload: (file: File, fieldKey: string) => Promise<string | null>;
	relationshipOptions: Array<{ key: string; value: string }>;
	paymentFrequencyOptions: Array<{ key: string; value: string }>;
	durationUnitOptions: Array<{ key: string; value: string }>;
	employmentStatusOptions: Array<{ key: string; value: string }>;
	stateOfOriginOptions: Array<{ key: string; value: string }>;
	refLoading: boolean;
	paymentMethod?: "once" | "installment";
	centeredContainer: (additionalClasses?: string) => string;
	sectionTitle: (additionalClasses?: string) => string;
	setUploadedFiles: React.Dispatch<React.SetStateAction<FileUploadState>>;
};

export default function InstallmentPaymentFormComponent({
	form,
	handleChange,
	isSubmitting,
	onSubmit,
	uploadedFiles,
	uploadedFieldsRef,
	handleFileUpload,
	relationshipOptions,
	paymentFrequencyOptions,
	durationUnitOptions,
	employmentStatusOptions,
	stateOfOriginOptions,
	refLoading,
	paymentMethod,
	centeredContainer,
	sectionTitle,
	setUploadedFiles,
}: Props) {
	return (
		<form onSubmit={onSubmit} className="space-y-6">
			{/* Personal details */}
			<PersonalDetailsSection form={form} handleChange={handleChange} centeredContainer={centeredContainer} sectionTitle={sectionTitle} />
			<IndigeneCertificateSection
				uploadedFiles={uploadedFiles}
				uploadedFieldsRef={uploadedFieldsRef}
				handleFileUpload={handleFileUpload}
				setUploadedFiles={setUploadedFiles}
			/>
			<hr className="my-6" />

			{/* Identification Document */}
			<IdentificationDocumentSection
				form={form}
				handleChange={handleChange}
				uploadedFiles={uploadedFiles}
				uploadedFieldsRef={uploadedFieldsRef}
				handleFileUpload={handleFileUpload}
				centeredContainer={centeredContainer}
				sectionTitle={sectionTitle}
				setUploadedFiles={setUploadedFiles}
			/>

			{/* Next of Kin */}
			<NextOfKinSection
				form={form}
				handleChange={handleChange}
				relationshipOptions={relationshipOptions}
				refLoading={refLoading}
				centeredContainer={centeredContainer}
				sectionTitle={sectionTitle}
			/>

			{/* Employment Details */}
			<EmploymentDetailsSection
				form={form}
				handleChange={handleChange}
				employmentStatusOptions={employmentStatusOptions}
				refLoading={refLoading}
				centeredContainer={centeredContainer}
				sectionTitle={sectionTitle}
			/>

			{/* Authorization Agreement */}
			<div className={centeredContainer()}>
				<CheckboxField
					labelClassName="font-normal text-stone-600"
					wrapperClassName="items-start mb-4 gap-3"
					id="authorization_agree"
					label={
						<span className="text-sm">
							I hereby authorise <span className="font-medium">Kpoi Kpoi Mingi Investments Ltd</span> to retrieve the electrical appliance from me, or
							any other person at my or any other place it may be found in the event of my default in paying the Hire Purchase sum as agreed.
						</span>
					}
					labelPosition="right"
				/>
			</div>
			<hr className="my-6" />

			{/* Property Details */}
			<PropertyDetailsSection
				form={form}
				handleChange={handleChange}
				paymentFrequencyOptions={paymentFrequencyOptions}
				durationUnitOptions={durationUnitOptions}
				employmentStatusOptions={employmentStatusOptions}
				refLoading={refLoading}
				paymentMethod={paymentMethod}
				centeredContainer={centeredContainer}
				sectionTitle={sectionTitle}
			/>
			<hr className="my-6" />

			{/* Clarification & Guarantor */}
			<div className="mt-6 space-y-6">
				<ClarificationDetailsSection form={form} handleChange={handleChange} centeredContainer={centeredContainer} sectionTitle={sectionTitle} />
				<hr className="my-6" />
				<GuarantorSection
					form={form}
					handleChange={handleChange}
					uploadedFiles={uploadedFiles}
					uploadedFieldsRef={uploadedFieldsRef}
					handleFileUpload={handleFileUpload}
					employmentStatusOptions={employmentStatusOptions}
					stateOfOriginOptions={stateOfOriginOptions}
					refLoading={refLoading}
					centeredContainer={centeredContainer}
					sectionTitle={sectionTitle}
					setUploadedFiles={setUploadedFiles}
				/>
			</div>

			<div className="flex justify-center mt-8">
				<ActionButton type="submit" className="w-full py-4 md:w-2/3 bg-primary text-white" disabled={isSubmitting}>
					{isSubmitting ? (
						<>
							<Spinner className="size-4" />
							<span>Processing...</span>
						</>
					) : (
						"Save Changes"
					)}
				</ActionButton>
			</div>
		</form>
	);
}
