import React from "react";
import CustomInput from "./CustomInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { inputStyle, labelStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import CheckboxField from "./CheckboxField";
import UploadBox from "./UploadBox";
import { PhoneIcon, EmailIcon } from "@/assets/icons";
import type { FileUploadState } from "@/types/customerRegistration";

export interface GuarantorData {
	fullName: string;
	occupation: string;
	phone: string;
	email: string;
	employmentStatus: string;
	employerName?: string;
	homeAddress?: string;
	businessAddress?: string;
	stateOfOrigin: string;
	hasAgreed?: boolean;
}

type Props = {
	guarantor: GuarantorData;
	guarantorIndex: number;
	onFieldChange: (field: keyof GuarantorData, value: unknown) => void;
	uploadedFiles: FileUploadState;
	uploadedFieldsRef: React.MutableRefObject<Set<string>>;
	handleFileUpload: (file: File, fieldKey: string) => Promise<string | null>;
	setUploadedFiles: React.Dispatch<React.SetStateAction<FileUploadState>>;
	employmentStatusOptions: Array<{ key: string; value: string }>;
	stateOfOriginOptions: Array<{ key: string; value: string }>;
};

export default function GuarantorField({
	guarantor,
	guarantorIndex,
	onFieldChange,
	uploadedFiles,
	uploadedFieldsRef,
	handleFileUpload,
	setUploadedFiles,
	employmentStatusOptions,
	stateOfOriginOptions,
}: Props) {
	const documentKey = `guarantor_${guarantorIndex}_doc`;

	return (
		<div>
			<h3 className="text-lg font-medium">Guarantor ({guarantorIndex + 1})</h3>

			<div className="mt-4">
				<CheckboxField
					wrapperClassName="items-start mb-4 gap-3"
					labelClassName="font-normal text-stone-600"
					id={`guarantor_agree_${guarantorIndex}`}
					checked={guarantor.hasAgreed ?? false}
					onCheckedChange={(checked) => {
						onFieldChange("hasAgreed", checked);
					}}
					label={
						<div>
							<span className="text-sm">
								As a guarantor, I hereby guaranty to pay all sums due under the Hire Purchase Agreement in the event of default by the Applicant.
							</span>
							<p className="text-sm mt-3">
								I accept that messages, notices, processes and other correspondences where necessary, sent to my WhatsApp number as shown herein are
								properly delivered and served on me.
							</p>
						</div>
					}
					labelPosition="right"
				/>
			</div>

			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				<CustomInput
					label="Full name"
					required
					labelClassName={labelStyle()}
					value={guarantor.fullName}
					onChange={(e) => onFieldChange("fullName", e.target.value)}
					className={twMerge(inputStyle)}
				/>
				<CustomInput
					label="Occupation"
					required
					labelClassName={labelStyle()}
					value={guarantor.occupation}
					onChange={(e) => onFieldChange("occupation", e.target.value)}
					className={twMerge(inputStyle)}
				/>
			</div>

			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				<CustomInput
					label="Phone number"
					required
					labelClassName={labelStyle()}
					value={guarantor.phone}
					type="tel"
					inputMode="numeric"
					pattern="\d*"
					maxLength={11}
					onKeyDown={(e) => {
						if (e.key.length === 1 && !/\d/.test(e.key)) e.preventDefault();
					}}
					onChange={(e) => onFieldChange("phone", e.target.value)}
					className={twMerge(inputStyle)}
					iconRight={<PhoneIcon />}
				/>

				<CustomInput
					label="Email"
					required
					labelClassName={labelStyle()}
					value={guarantor.email}
					onChange={(e) => onFieldChange("email", e.target.value)}
					className={twMerge(inputStyle)}
					iconRight={<EmailIcon />}
				/>
			</div>

			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className={labelStyle()}>Employment status*</label>
					<Select value={guarantor.employmentStatus} onValueChange={(v) => onFieldChange("employmentStatus", v)}>
						<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 cursor-pointer")}>
							<SelectValue placeholder="Select status" />
						</SelectTrigger>
						<SelectContent>
							{employmentStatusOptions.length === 0 ? (
								<>
									<SelectItem value="1">EMPLOYED</SelectItem>
									<SelectItem value="2">SELF EMPLOYED</SelectItem>
								</>
							) : (
								employmentStatusOptions.map((it) => (
									<SelectItem key={it.key} value={it.key}>
										{it.value}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
				</div>

				{guarantor.employmentStatus == "1" ? (
					<CustomInput
						label="Employer name"
						required
						labelClassName={labelStyle()}
						value={guarantor.employerName || ""}
						onChange={(e) => onFieldChange("employerName", e.target.value)}
						className={twMerge(inputStyle)}
					/>
				) : (
					<CustomInput
						label="Home address"
						required
						labelClassName={labelStyle()}
						value={guarantor.homeAddress || ""}
						onChange={(e) => onFieldChange("homeAddress", e.target.value)}
						className={twMerge(inputStyle)}
					/>
				)}
			</div>

			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				{guarantor.employmentStatus === "1" && (
					<CustomInput
						label="Company address"
						required
						labelClassName={labelStyle()}
						value={guarantor.businessAddress || ""}
						onChange={(e) => onFieldChange("businessAddress", e.target.value)}
						className={twMerge(inputStyle)}
					/>
				)}

				<div>
					<label className={labelStyle()}>State of origin*</label>
					<Select value={guarantor.stateOfOrigin} onValueChange={(v) => onFieldChange("stateOfOrigin", v)}>
						<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 cursor-pointer")}>
							<SelectValue placeholder="Select state" />
						</SelectTrigger>
						<SelectContent>
							{stateOfOriginOptions?.length === 0 ? (
								<>
									<SelectItem value="error">Error</SelectItem>
								</>
							) : (
								stateOfOriginOptions?.map((it) => (
									<SelectItem key={it.key} value={it.key}>
										{it.value}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="mt-7">
				<UploadBox
					placeholder={uploadedFiles[documentKey]?.length ? `${uploadedFiles[documentKey]?.length} document uploaded` : "Upload identity document"}
					hint={uploadedFiles[documentKey]?.length ? `${uploadedFiles[documentKey]?.length} document(s) uploaded` : "PNG, JPG, PDF Only"}
					isUploaded={uploadedFieldsRef.current.has(documentKey)}
					uploadedFiles={
						uploadedFiles[documentKey]?.map((file) => {
							const raw = file.includes("/") ? file.split("/").pop() || "Document" : file;
							const filename = raw.split("?")[0];
							const decodedName = decodeURIComponent(filename);
							return {
								name: decodedName,
								onRemove: () => {
									uploadedFieldsRef.current.delete(documentKey);
									setUploadedFiles((prev) => ({
										...prev,
										[documentKey]: prev[documentKey]?.filter((f) => f !== file),
									}));
								},
							};
						}) || []
					}
					onChange={async (files) => {
						if (files[0]) {
							await handleFileUpload(files[0], documentKey);
						}
					}}
				/>
			</div>
		</div>
	);
}
