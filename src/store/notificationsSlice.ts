import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { NotificationItem } from "@/types/notifications";

type Pagination = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

type State = {
	items: NotificationItem[];
	pagination: Pagination;
	isLoading: boolean;
};

const initialState: State = {
	items: [],
	pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
	isLoading: false,
};

const slice = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		setNotifications(state, action: PayloadAction<NotificationItem[]>) {
			state.items = action.payload;
		},
		addNotification(state, action: PayloadAction<NotificationItem>) {
			state.items.unshift(action.payload);
			state.pagination.total = Math.max(0, state.pagination.total + 1);
		},
		setPagination(state, action: PayloadAction<Pagination>) {
			state.pagination = action.payload;
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.isLoading = action.payload;
		},
		clearNotifications(state) {
			state.items = [];
			state.pagination = initialState.pagination;
		},
	},
});

export const { setNotifications, addNotification, setPagination, setLoading, clearNotifications } = slice.actions;
export default slice.reducer;
