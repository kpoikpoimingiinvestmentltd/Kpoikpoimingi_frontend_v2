import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ReportAnalyticsState {
	tab: "vat" | "interest";
	// VAT specific
	vatPage: number;
	vatLimit: number;
	vatSortBy: string;
	vatSortOrder: string;
	vatFromDate: string | null;
	vatToDate: string | null;
	isFilterApplied: boolean;
	// Penalties specific
	penaltyPage: number;
	penaltySearch: string;
	penaltyLimit: number;
	penaltySortBy: string;
	penaltySortOrder: string;
	// Periods
	incomePeriod: string;
	vatPeriod: string;
	penaltyPeriod: string;
}

const initialState: ReportAnalyticsState = {
	tab: "vat",
	// VAT specific
	vatPage: 1,
	vatLimit: 10,
	vatSortBy: "createdAt",
	vatSortOrder: "desc",
	vatFromDate: null,
	vatToDate: null,
	isFilterApplied: false,
	// Penalties specific
	penaltyPage: 1,
	penaltySearch: "",
	penaltyLimit: 10,
	penaltySortBy: "name",
	penaltySortOrder: "asc",
	// Periods
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
		setVatPage: (state, action: PayloadAction<number>) => {
			state.vatPage = action.payload;
		},
		setVatLimit: (state, action: PayloadAction<number>) => {
			state.vatLimit = action.payload;
		},
		setVatSortBy: (state, action: PayloadAction<string>) => {
			state.vatSortBy = action.payload;
		},
		setVatSortOrder: (state, action: PayloadAction<string>) => {
			state.vatSortOrder = action.payload;
		},
		setVatFromDate: (state, action: PayloadAction<string | null>) => {
			state.vatFromDate = action.payload;
		},
		setVatToDate: (state, action: PayloadAction<string | null>) => {
			state.vatToDate = action.payload;
		},
		setIsFilterApplied: (state, action: PayloadAction<boolean>) => {
			state.isFilterApplied = action.payload;
		},
		setPenaltyPage: (state, action: PayloadAction<number>) => {
			state.penaltyPage = action.payload;
		},
		setPenaltySearch: (state, action: PayloadAction<string>) => {
			state.penaltySearch = action.payload;
		},
		setPenaltyLimit: (state, action: PayloadAction<number>) => {
			state.penaltyLimit = action.payload;
		},
		setPenaltySortBy: (state, action: PayloadAction<string>) => {
			state.penaltySortBy = action.payload;
		},
		setPenaltySortOrder: (state, action: PayloadAction<string>) => {
			state.penaltySortOrder = action.payload;
		},
		clearPenaltyFilters: (state) => {
			state.penaltyPage = 1;
			state.penaltySearch = "";
			state.penaltyLimit = 10;
			state.penaltySortBy = "name";
			state.penaltySortOrder = "asc";
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
			state.vatFromDate = null;
			state.vatToDate = null;
			state.vatSortBy = "createdAt";
			state.vatSortOrder = "desc";
			state.vatPage = 1;
			state.vatLimit = 10;
			state.isFilterApplied = false;
		},
	},
});

export const {
	setTab,
	setVatPage,
	setVatLimit,
	setVatSortBy,
	setVatSortOrder,
	setVatFromDate,
	setVatToDate,
	setIsFilterApplied,
	setPenaltyPage,
	setPenaltySearch,
	setPenaltyLimit,
	setPenaltySortBy,
	setPenaltySortOrder,
	setIncomePeriod,
	setVatPeriod,
	setPenaltyPeriod,
	clearFilters,
	clearPenaltyFilters,
} = reportAnalyticsSlice.actions;

export default reportAnalyticsSlice.reducer;
