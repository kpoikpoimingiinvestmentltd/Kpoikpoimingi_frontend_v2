export type AuditLogItem = {
	id: string;
	action: string;
	staffName?: string | null;
	email?: string | null;
	role?: string | null;
	/** Enum key from DB entityType, e.g. PURCHASE_BATCH */
	entityType?: string | null;
	/** Numeric EntityType from DB */
	entityTypeId?: number | null;
	/** Subject label derived server-side from DB entityType */
	subjectLabel?: string | null;
	/** Area label derived server-side from DB entityType */
	area?: string | null;
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
