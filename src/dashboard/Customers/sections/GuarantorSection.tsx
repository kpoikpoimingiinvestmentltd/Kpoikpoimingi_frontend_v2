import React from "react";
import CustomInput from "@/components/base/CustomInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { inputStyle, labelStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import CheckboxField from "@/components/base/CheckboxField";
import UploadBox from "@/components/base/UploadBox";
import { PhoneIcon, EmailIcon } from "@/assets/icons";
import type { InstallmentPaymentForm, FileUploadState } from "@/types/customerRegistration";

type Props = {
	form: InstallmentPaymentForm;
	handleChange: (key: string, value: unknown) => void;
	uploadedFiles: FileUploadState;
	uploadedFieldsRef: React.MutableRefObject<Set<string>>;
	handleFileUpload: (file: File, fieldKey: string) => Promise<string | null>;
	employmentStatusOptions: Array<{ key: string; value: string }>;
	stateOfOriginOptions: Array<{ key: string; value: string }>;
	refLoading: boolean;
	centeredContainer: (additionalClasses?: string) => string;
	sectionTitle: (additionalClasses?: string) => string;
	setUploadedFiles: React.Dispatch<React.SetStateAction<FileUploadState>>;
};

export default function GuarantorSection({
	form,
	handleChange,
	uploadedFiles,
	uploadedFieldsRef,
	handleFileUpload,
	employmentStatusOptions,
	stateOfOriginOptions,
	refLoading,
	centeredContainer,
	sectionTitle,
	setUploadedFiles,
}: Props) {
	return (
		<div className={centeredContainer()}>
			<h3 className={sectionTitle()}>Guarantor Details</h3>

			<div className="mt-4 flex flex-col gap-y-6">
				{form.guarantors.map((g: InstallmentPaymentForm["guarantors"][number], idx: number) => (
					<div key={idx}>
						<h3 className="text-lg font-medium">Guarantor ({idx + 1})</h3>

						<div className="mt-4">
							<CheckboxField
								wrapperClassName="items-start mb-4 gap-3"
								labelClassName="font-normal text-stone-600"
								id={`guarantor_agree_${idx}`}
								label={
									<div>
										<span className="text-sm">
											As a guarantor, I hereby guaranty to pay all sums due under the Hire Purchase Agreement in the event of default by the
											Applicant.
										</span>
										<p className="text-sm mt-3">
											I accept that messages, notices, processes and other correspondences where necessary, sent to my WhatsApp number as shown herein
											are properly delivered and served on me.
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
								value={g.fullName}
								onChange={(e) => {
									const next = [...form.guarantors];
									next[idx] = { ...next[idx], fullName: e.target.value };
									handleChange("guarantors", next);
								}}
								className={twMerge(inputStyle)}
							/>
							<CustomInput
								label="Occupation"
								required
								labelClassName={labelStyle()}
								value={g.occupation}
								onChange={(e) => {
									const next = [...form.guarantors];
									next[idx] = { ...next[idx], occupation: e.target.value };
									handleChange("guarantors", next);
								}}
								className={twMerge(inputStyle)}
							/>
						</div>

						<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
							<CustomInput
								label="Phone number"
								required
								labelClassName={labelStyle()}
								value={g.phone}
								type="tel"
								inputMode="numeric"
								pattern="\d*"
								maxLength={11}
								onKeyDown={(e) => {
									if (e.key.length === 1 && !/\d/.test(e.key)) e.preventDefault();
								}}
								onChange={(e) => {
									const next = [...form.guarantors];
									next[idx] = { ...next[idx], phone: e.target.value };
									handleChange("guarantors", next);
								}}
								className={twMerge(inputStyle)}
								iconRight={<PhoneIcon />}
							/>

							<CustomInput
								label="Email"
								required
								labelClassName={labelStyle()}
								value={g.email}
								onChange={(e) => {
									const next = [...form.guarantors];
									next[idx] = { ...next[idx], email: e.target.value };
									handleChange("guarantors", next);
								}}
								className={twMerge(inputStyle)}
								iconRight={<EmailIcon />}
							/>
						</div>

						<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className={labelStyle()}>Employment status*</label>
								<Select
									value={g.employmentStatus}
									onValueChange={(v) => {
										const next = [...form.guarantors];
										next[idx] = { ...next[idx], employmentStatus: v };
										handleChange("guarantors", next);
									}}>
									<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 cursor-pointer")}>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										{refLoading ? (
											<div className="p-3 text-center">
												<Spinner className="size-4" />
											</div>
										) : employmentStatusOptions.length === 0 ? (
											<>
												<SelectItem value="Civil servant">Civil servant</SelectItem>
												<SelectItem value="Self employer">Self employer</SelectItem>
												<SelectItem value="Unemployed">Unemployed</SelectItem>
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

							<CustomInput
								label="Home address"
								required
								labelClassName={labelStyle()}
								value={g.homeAddress}
								onChange={(e) => {
									const next = [...form.guarantors];
									next[idx] = { ...next[idx], homeAddress: e.target.value };
									handleChange("guarantors", next);
								}}
								className={twMerge(inputStyle)}
							/>
						</div>

						<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
							<CustomInput
								label="Business address"
								required
								labelClassName={labelStyle()}
								value={g.businessAddress}
								onChange={(e) => {
									const next = [...form.guarantors];
									next[idx] = { ...next[idx], businessAddress: e.target.value };
									handleChange("guarantors", next);
								}}
								className={twMerge(inputStyle)}
							/>

							<div>
								<label className={labelStyle()}>State of origin*</label>
								<Select
									value={g.stateOfOrigin}
									onValueChange={(v) => {
										const next = [...form.guarantors];
										next[idx] = { ...next[idx], stateOfOrigin: v };
										handleChange("guarantors", next);
									}}>
									<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 cursor-pointer")}>
										<SelectValue placeholder="Select state" />
									</SelectTrigger>
									<SelectContent>
										{refLoading ? (
											<div className="p-3 text-center">
												<Spinner className="size-4" />
											</div>
										) : stateOfOriginOptions?.length === 0 ? (
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
								placeholder={
									uploadedFiles[`guarantor_${idx}_doc`]?.length
										? `${uploadedFiles[`guarantor_${idx}_doc`]?.length} document uploaded`
										: "Upload voters card"
								}
								hint={
									uploadedFiles[`guarantor_${idx}_doc`]?.length
										? `${uploadedFiles[`guarantor_${idx}_doc`]?.length} document(s) uploaded`
										: "PNG, JPG, PDF Only"
								}
								isUploaded={uploadedFieldsRef.current.has(`guarantor_${idx}_doc`)}
								uploadedFiles={
									uploadedFiles[`guarantor_${idx}_doc`]?.map((file) => {
										const raw = file.includes("/") ? file.split("/").pop() || "Document" : file;
										const filename = raw.split("?")[0];
										const decodedName = decodeURIComponent(filename);
										return {
											name: decodedName,
											onRemove: () => {
												uploadedFieldsRef.current.delete(`guarantor_${idx}_doc`);
												setUploadedFiles((prev) => ({
													...prev,
													[`guarantor_${idx}_doc`]: prev[`guarantor_${idx}_doc`]?.filter((f) => f !== file),
												}));
											},
										};
									}) || []
								}
								onChange={async (files) => {
									if (files[0]) {
										await handleFileUpload(files[0], `guarantor_${idx}_doc`);
									}
								}}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
