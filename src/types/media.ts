// Types for media-related API routes
export type PresignUploadRequest = {
	filename: string;
	contentType: string;
	relatedTable?: string; // default to "user"
};

export type PresignUploadResponse = { key: string; url?: string; uploadUrl?: string };
