// Types for notifications
export type NotificationItem = {
	id: string;
	title?: string;
	subtitle?: string;
	time?: string;
	read?: boolean;
	type?: string;
};

export type NotificationsPagination = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

export type NotificationsResponse = {
	data: NotificationItem[];
	pagination: NotificationsPagination;
};

// API response item shape (may differ from the store's NotificationItem)
export type ApiNotification = {
	id: string;
	message: string;
	createdAt: string;
	isRead: boolean;
	type?: { type?: string } | null;
	[key: string]: unknown;
};

export type NotificationsApiResponse = {
	data: ApiNotification[];
	pagination: NotificationsPagination;
};
