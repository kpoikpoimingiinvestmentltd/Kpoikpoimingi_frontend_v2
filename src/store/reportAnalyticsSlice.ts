import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ReportAnalyticsState {
	tab: "vat" | "interest";
	page: number;
	search: string;
	fromDate: string | null;
	toDate: string | null;
	isFilterApplied: boolean;
	sortBy: string;
	sortOrder: string;
	incomePeriod: string;
	vatPeriod: string;
	penaltyPeriod: string;
}

const initialState: ReportAnalyticsState = {
	tab: "vat",
	page: 1,
	search: "",
	fromDate: null,
	toDate: null,
	isFilterApplied: false,
	sortBy: "createdAt",
	sortOrder: "desc",
	incomePeriod: "daily",
	vatPeriod: "daily",
	penaltyPeriod: "daily",
};

const reportAnalyticsSlice = createSlice({
	name: "reportAnalytics",
	initialState,
	reducers: {
		setTab: (state, action: PayloadAction<"vat" | "interest">) => {
			state.tab = action.payload;
		},
		setPage: (state, action: PayloadAction<number>) => {
			state.page = action.payload;
		},
		setSearch: (state, action: PayloadAction<string>) => {
			state.search = action.payload;
		},
		setFromDate: (state, action: PayloadAction<string | null>) => {
			state.fromDate = action.payload;
		},
		setToDate: (state, action: PayloadAction<string | null>) => {
			state.toDate = action.payload;
		},
		setIsFilterApplied: (state, action: PayloadAction<boolean>) => {
			state.isFilterApplied = action.payload;
		},
		setSortBy: (state, action: PayloadAction<string>) => {
			state.sortBy = action.payload;
		},
		setSortOrder: (state, action: PayloadAction<string>) => {
			state.sortOrder = action.payload;
		},
		setIncomePeriod: (state, action: PayloadAction<string>) => {
			state.incomePeriod = action.payload;
		},
		setVatPeriod: (state, action: PayloadAction<string>) => {
			state.vatPeriod = action.payload;
		},
		setPenaltyPeriod: (state, action: PayloadAction<string>) => {
			state.penaltyPeriod = action.payload;
		},
		clearFilters: (state) => {
			state.fromDate = null;
			state.toDate = null;
			state.sortBy = "createdAt";
			state.sortOrder = "desc";
			state.search = "";
			state.page = 1;
			state.isFilterApplied = false;
		},
	},
});

export const {
	setTab,
	setPage,
	setSearch,
	setFromDate,
	setToDate,
	setIsFilterApplied,
	setSortBy,
	setSortOrder,
	setIncomePeriod,
	setVatPeriod,
	setPenaltyPeriod,
	clearFilters,
} = reportAnalyticsSlice.actions;

export default reportAnalyticsSlice.reducer;
