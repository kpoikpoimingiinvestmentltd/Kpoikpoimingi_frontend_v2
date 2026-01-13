export interface UploadResult {
	success: boolean;
	key?: string;
	error?: string;
}

export async function uploadFileToPresignedUrl(presignedUrl: string, file: File, onProgress?: (progress: number) => void): Promise<UploadResult> {
	try {
		// mark onProgress as used to avoid unused parameter TS errors where callers may optionally pass it
		void onProgress;
		if (!presignedUrl) {
			return { success: false, error: "No presigned URL provided" };
		}

		const response = await fetch(presignedUrl, {
			method: "PUT",
			body: file,
			headers: {
				"Content-Type": file.type,
			},
		});

		if (!response.ok) {
			throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
		}

		// Assuming the key is returned or can be derived, but typically presigned URL upload doesn't return the key
		// The key would be from the presign response
		return { success: true };
	} catch (error) {
		console.error("File upload error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown upload error",
		};
	}
}
