import React from "react";
import { toast } from "sonner";
import UploadBox from "@/components/base/UploadBox";
import type { InstallmentPaymentForm, FileUploadState } from "@/types/customerRegistration";

type Props = {
	form: InstallmentPaymentForm;
	handleChange: (key: string, value: unknown) => void;
	uploadedFiles: FileUploadState;
	uploadedFieldsRef: React.MutableRefObject<Set<string>>;
	handleFileUpload: (file: File, fieldKey: string) => Promise<string | null>;
	centeredContainer: (additionalClasses?: string) => string;
	sectionTitle: (additionalClasses?: string) => string;
	setUploadedFiles: React.Dispatch<React.SetStateAction<FileUploadState>>;
	showSignedContract?: boolean;
};

export default function IdentificationDocumentSection({
	form,
	handleChange,
	uploadedFiles,
	uploadedFieldsRef,
	handleFileUpload,
	centeredContainer,
	sectionTitle,
	setUploadedFiles,
	showSignedContract = false,
}: Props) {
	return (
		<>
			<div className={centeredContainer()}>
				<h3 className={sectionTitle()}>Identification Document</h3>
				<div className="mt-4 flex items-center gap-4">
					<div className="flex items-center gap-2">
						<label className="text-sm mr-2">Are you a driver?</label>
						<button
							type="button"
							onClick={() => handleChange("isDriver", true)}
							className={form.isDriver === true ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
							Yes
						</button>
						<button
							type="button"
							onClick={() => handleChange("isDriver", false)}
							className={form.isDriver === false ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
							No
						</button>
					</div>
				</div>

				<div className="my-8 space-y-4">
					<UploadBox
						placeholder={uploadedFiles.nin?.length ? `${uploadedFiles.nin.length} document uploaded` : "Upload NIN or Voters Card"}
						isUploaded={uploadedFieldsRef.current.has("nin")}
						uploadedFiles={
							uploadedFiles.nin?.map((file) => {
								const raw = file.includes("/") ? file.split("/").pop() || "NIN" : file;
								const filename = raw.split("?")[0];
								const decodedName = decodeURIComponent(filename);
								return {
									name: decodedName,
									onRemove: () => {
										uploadedFieldsRef.current.delete("nin");
										setUploadedFiles((prev) => ({
											...prev,
											nin: prev.nin?.filter((f) => f !== file),
										}));
									},
								};
							}) || []
						}
						multiple={true}
						onChange={async (files) => {
							if (!files || files.length === 0) return;
							if (files.length < 2) {
								toast.error("Please upload two identification documents");
								return;
							}
							// Upload up to first two selected files
							for (let i = 0; i < Math.min(2, files.length); i++) {
								await handleFileUpload(files[i], "nin");
							}
						}}
					/>
					{form.isDriver === true && (
						<UploadBox
							placeholder={uploadedFiles.driverLicense?.length ? `${uploadedFiles.driverLicense.length} license uploaded` : "Upload Drivers License"}
							isUploaded={uploadedFieldsRef.current.has("driverLicense")}
							uploadedFiles={
								uploadedFiles.driverLicense?.map((file) => {
									const raw = file.includes("/") ? file.split("/").pop() || "License" : file;
									const filename = raw.split("?")[0];
									const decodedName = decodeURIComponent(filename);
									return {
										name: decodedName,
										onRemove: () => {
											uploadedFieldsRef.current.delete("driverLicense");
											setUploadedFiles((prev) => ({
												...prev,
												driverLicense: prev.driverLicense?.filter((f) => f !== file),
											}));
										},
									};
								}) || []
							}
							onChange={async (files) => {
								if (files[0]) {
									await handleFileUpload(files[0], "driverLicense");
								}
							}}
						/>
					)}
					{showSignedContract && (
						<UploadBox
							placeholder={uploadedFiles.contract?.length ? `${uploadedFiles.contract.length} contract uploaded` : "Upload signed contract"}
							isUploaded={uploadedFieldsRef.current.has("contract")}
							uploadedFiles={
								uploadedFiles.contract?.map((file) => {
									const raw = file.includes("/") ? file.split("/").pop() || "Contract" : file;
									const filename = raw.split("?")[0];
									const decodedName = decodeURIComponent(filename);
									return {
										name: decodedName,
										onRemove: () => {
											uploadedFieldsRef.current.delete("contract");
											setUploadedFiles((prev) => ({
												...prev,
												contract: prev.contract?.filter((f) => f !== file),
											}));
										},
									};
								}) || []
							}
							onChange={async (files) => {
								if (files[0]) {
									await handleFileUpload(files[0], "contract");
								}
							}}
						/>
					)}
				</div>
			</div>
			<hr className="my-6" />
		</>
	);
}
