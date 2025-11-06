import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { usePresignUploadMutation } from "@/api/presign-upload.api";
import { uploadFileToPresignedUrl } from "@/utils/media-upload";
import { toast } from "sonner";

interface UploadResponse {
	success: boolean;
	key?: string;
	error?: string;
}

const AdminDashboard: React.FC = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [relatedTable, setRelatedTable] = useState<string>("user");

	const [presignUpload] = usePresignUploadMutation();

	const uploadMutation = useMutation({
		mutationFn: async (file: File): Promise<UploadResponse> => {
			// First, get presigned URL
			const presignResult = await presignUpload({
				filename: file.name,
				contentType: file.type,
				relatedTable,
			}).unwrap();

			// Then, upload the file. Normalize presign response in case it's nested.
			const uploadUrl = (presignResult as any)?.uploadUrl ?? (presignResult as any)?.data?.uploadUrl ?? (presignResult as any)?.url;
			if (!uploadUrl) {
				console.error("Presign response missing uploadUrl", presignResult);
				throw new Error("Presign upload did not return an uploadUrl");
			}

			const uploadResult = await uploadFileToPresignedUrl(uploadUrl, file);

			return {
				...uploadResult,
				key: (presignResult as any)?.key ?? (presignResult as any)?.data?.key,
			};
		},
		onSuccess: (data) => {
			if (data.success) {
				toast.success("File uploaded successfully!");
				setSelectedFile(null);
			} else {
				toast.error(`Upload failed: ${data.error}`);
			}
		},
		onError: (error: any) => {
			toast.error(`Upload error: ${error.message || "Unknown error"}`);
		},
	});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const handleUpload = () => {
		if (selectedFile) {
			uploadMutation.mutate(selectedFile);
		}
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Admin Dashboard - File Upload</h1>

			<div className="mb-4">
				<label htmlFor="relatedTable" className="block text-sm font-medium mb-2">
					Related Table
				</label>
				<select
					id="relatedTable"
					value={relatedTable}
					onChange={(e) => setRelatedTable(e.target.value)}
					className="border border-gray-300 rounded px-3 py-2">
					<option value="user">User</option>
					<option value="property">Property</option>
					<option value="other">Other</option>
				</select>
			</div>

			<div className="mb-4">
				<label htmlFor="fileInput" className="block text-sm font-medium mb-2">
					Select File
				</label>
				<input id="fileInput" type="file" onChange={handleFileChange} className="border border-gray-300 rounded px-3 py-2" />
				{selectedFile && (
					<p className="mt-2 text-sm text-gray-600">
						Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
					</p>
				)}
			</div>

			<button
				onClick={handleUpload}
				disabled={!selectedFile || uploadMutation.isPending}
				className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300">
				{uploadMutation.isPending ? "Uploading..." : "Upload File"}
			</button>

			{uploadMutation.isError && <p className="mt-4 text-red-500">Error: {uploadMutation.error?.message || "Upload failed"}</p>}
		</div>
	);
};

export default AdminDashboard;
