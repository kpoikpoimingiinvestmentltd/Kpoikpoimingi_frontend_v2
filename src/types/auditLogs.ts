export type AuditLogItem = {
	id: string;
	action: string;
	staffName?: string | null;
	email?: string | null;
	role?: string | null;
	entityType?: string | null;
	date: string;
	time: string;
	userId?: string;
	createdAt?: string;
};

export type AuditLogGroup = {
	title: string;
	isCurrentMonth?: boolean;
	logs: AuditLogItem[];
};

export type AuditLogsGroupedResponse = {
	data: AuditLogGroup[];
	pagination: {
		total: number;
		totalPages: number;
		page?: number;
		limit?: number;
	};
};
