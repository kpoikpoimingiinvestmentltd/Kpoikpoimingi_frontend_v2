// Types for email testing endpoints
export type EmailTestResponse = { success: boolean };

// Types for SendEmailModal component
export type SendEmailModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	customers?: Array<{ id: string; email: string; name?: string }>;
	onSend?: (data: SendEmailData) => void | Promise<void>;
};

export type SendEmailData = {
	tab: "specific" | "all";
	emailAddresses: string[];
	subject: string;
	details: string;
};

export type SendEmailFormData = {
	subject: string;
	details: string;
};

// Types for customer email endpoints
export interface SendEmailSpecificPayload {
	emailAddresses: string[];
	subject: string;
	message: string;
}

export interface SendEmailBroadcastPayload {
	subject: string;
	message: string;
	filterApprovedOnly?: boolean;
}

export interface SendEmailResponse {
	message: string;
	successful: number;
	failed: number;
	totalRequested?: number;
	found?: number;
	recipients?: Array<{ email: string; name: string }>;
	totalCustomers?: number;
	filterApprovedOnly?: boolean;
}
