import React from "react";
import UploadBox from "@/components/base/UploadBox";
import type { FileUploadState } from "@/types/customerRegistration";

type Props = {
	uploadedFiles: FileUploadState;
	uploadedFieldsRef: React.MutableRefObject<Set<string>>;
	handleFileUpload: (file: File, fieldKey: string) => Promise<string | null>;
	setUploadedFiles: React.Dispatch<React.SetStateAction<FileUploadState>>;
};

export default function IndigeneCertificateSection({ uploadedFiles, uploadedFieldsRef, handleFileUpload, setUploadedFiles }: Props) {
	return (
		<div className="mt-6">
			<UploadBox
				placeholder={
					uploadedFiles.indigeneCertificate?.length
						? `${uploadedFiles.indigeneCertificate.length} certificate uploaded`
						: "Upload Indigene certificate"
				}
				isUploaded={uploadedFieldsRef.current.has("indigeneCertificate")}
				uploadedFiles={
					uploadedFiles.indigeneCertificate?.map((file) => {
						const filename = file.includes("/") ? file.split("/").pop() || "certificate" : file;
						const decodedName = decodeURIComponent(filename);
						return {
							name: decodedName,
							onRemove: () => {
								uploadedFieldsRef.current.delete("indigeneCertificate");
								setUploadedFiles((prev) => ({
									...prev,
									indigeneCertificate: prev.indigeneCertificate?.filter((f) => f !== file),
								}));
							},
						};
					}) || []
				}
				onChange={async (files) => {
					if (files[0]) {
						await handleFileUpload(files[0], "indigeneCertificate");
					}
				}}
			/>
		</div>
	);
}
