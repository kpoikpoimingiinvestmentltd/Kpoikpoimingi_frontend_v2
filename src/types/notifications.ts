// Types for notifications
export type NotificationItem = {
	id: string;
	title: string;
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
