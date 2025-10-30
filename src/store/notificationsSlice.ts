import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type NotificationItem = {
	id: string;
	title: string;
	subtitle?: string;
	time?: string;
	read?: boolean;
	type?: string;
};

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

export const { setNotifications, setPagination, setLoading, clearNotifications } = slice.actions;
export default slice.reducer;
