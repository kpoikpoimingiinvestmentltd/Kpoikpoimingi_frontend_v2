import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { store } from "@/store";
import type { PresignUploadRequest, PresignUploadResponse } from "@/types/media";

const baseUrl = (import.meta as any).env?.VITE_API_URL ?? "/api";

export const presignUploadApi = createApi({
	reducerPath: "presignUploadApi",
	baseQuery: fetchBaseQuery({
		baseUrl,
		prepareHeaders: (headers) => {
			const token = store.getState().auth.accessToken;
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			return headers;
		},
	}),
	endpoints: (builder) => ({
		presignUpload: builder.mutation<PresignUploadResponse, PresignUploadRequest>({
			query: (body) => ({
				url: "media/presign-upload",
				method: "POST",
				body,
			}),
		}),
	}),
});

export const { usePresignUploadMutation } = presignUploadApi;
