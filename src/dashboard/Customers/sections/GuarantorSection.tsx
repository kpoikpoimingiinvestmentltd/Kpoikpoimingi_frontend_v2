import React from "react";
import GuarantorField from "@/components/base/GuarantorField";
import ValidationErrorDisplay from "@/components/common/ValidationErrorDisplay";
import type { InstallmentPaymentForm, FileUploadState } from "@/types/customerRegistration";

type Props = {
	form: InstallmentPaymentForm;
	handleChange: (key: string, value: unknown) => void;
	uploadedFiles: FileUploadState;
	uploadedFieldsRef: React.MutableRefObject<Set<string>>;
	handleFileUpload: (file: File, fieldKey: string) => Promise<string | null>;
	employmentStatusOptions: Array<{ key: string; value: string }>;
	stateOfOriginOptions: Array<{ key: string; value: string }>;
	centeredContainer: (additionalClasses?: string) => string;
	sectionTitle: (additionalClasses?: string) => string;
	setUploadedFiles: React.Dispatch<React.SetStateAction<FileUploadState>>;
	missingFields?: string[];
};

export default function GuarantorSection({
	form,
	handleChange,
	uploadedFiles,
	uploadedFieldsRef,
	handleFileUpload,
	employmentStatusOptions,
	stateOfOriginOptions,
	centeredContainer,
	sectionTitle,
	setUploadedFiles,
	missingFields = [],
}: Props) {
	return (
		<div className={centeredContainer()}>
			<h3 className={sectionTitle()}>Guarantor Details</h3>

			<div className="mt-4 flex flex-col gap-y-6">
				{form.guarantors.map((g: InstallmentPaymentForm["guarantors"][number], idx: number) => (
					<GuarantorField
						key={idx}
						guarantor={g}
						guarantorIndex={idx}
						onFieldChange={(field, value) => {
							const next = [...form.guarantors];
							next[idx] = { ...next[idx], [field]: value };
							handleChange("guarantors", next);
						}}
						uploadedFiles={uploadedFiles}
						uploadedFieldsRef={uploadedFieldsRef}
						handleFileUpload={handleFileUpload}
						setUploadedFiles={setUploadedFiles}
						employmentStatusOptions={employmentStatusOptions}
						stateOfOriginOptions={stateOfOriginOptions}
					/>
				))}
			</div>

			<ValidationErrorDisplay missingFields={missingFields} filter={(field) => field.toLowerCase().includes("guarantor")} />
		</div>
	);
}
