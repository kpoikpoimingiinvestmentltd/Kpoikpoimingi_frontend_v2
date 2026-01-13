import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface DuePaymentFilterState {
	page: number;
	search: string;
	csvModalOpen: boolean;
	sortBy: string;
	sortOrder: string;
	dueDateFrom: string;
	dueDateTo: string;
	dateFrom: string;
	dateTo: string;
	isOverdue: boolean | undefined;
	statusId: number | undefined;
}

const initialState: DuePaymentFilterState = {
	page: 1,
	search: "",
	csvModalOpen: false,
	sortBy: "dueDate",
	sortOrder: "asc",
	dueDateFrom: "",
	dueDateTo: "",
	dateFrom: "",
	dateTo: "",
	isOverdue: undefined,
	statusId: undefined,
};

const duePaymentSlice = createSlice({
	name: "duePayment",
	initialState,
	reducers: {
		setPage: (state, action: PayloadAction<number>) => {
			state.page = action.payload;
		},
		setSearch: (state, action: PayloadAction<string>) => {
			state.search = action.payload;
		},
		setCsvModalOpen: (state, action: PayloadAction<boolean>) => {
			state.csvModalOpen = action.payload;
		},
		setSortBy: (state, action: PayloadAction<string>) => {
			state.sortBy = action.payload;
		},
		setSortOrder: (state, action: PayloadAction<string>) => {
			state.sortOrder = action.payload;
		},
		setDueDateFrom: (state, action: PayloadAction<string>) => {
			state.dueDateFrom = action.payload;
		},
		setDueDateTo: (state, action: PayloadAction<string>) => {
			state.dueDateTo = action.payload;
		},
		setDateFrom: (state, action: PayloadAction<string>) => {
			state.dateFrom = action.payload;
		},
		setDateTo: (state, action: PayloadAction<string>) => {
			state.dateTo = action.payload;
		},
		setIsOverdue: (state, action: PayloadAction<boolean | undefined>) => {
			state.isOverdue = action.payload;
		},
		setStatusId: (state, action: PayloadAction<number | undefined>) => {
			state.statusId = action.payload;
		},
		applyFilters: (state, action: PayloadAction<Partial<DuePaymentFilterState>>) => {
			Object.assign(state, action.payload);
			state.page = 1;
		},
		resetFilters: () => {
			return initialState;
		},
	},
});

export const {
	setPage,
	setSearch,
	setCsvModalOpen,
	setSortBy,
	setSortOrder,
	setDueDateFrom,
	setDueDateTo,
	setDateFrom,
	setDateTo,
	setIsOverdue,
	setStatusId,
	applyFilters,
	resetFilters,
} = duePaymentSlice.actions;

export default duePaymentSlice.reducer;
