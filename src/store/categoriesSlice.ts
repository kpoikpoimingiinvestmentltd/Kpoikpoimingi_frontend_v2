import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Category, CategoriesState } from "@/types/propertyCategories";

const initialState: CategoriesState = {
	list: [],
};

const categoriesSlice = createSlice({
	name: "categories",
	initialState,
	reducers: {
		setCategories(state, action: PayloadAction<Category[]>) {
			state.list = action.payload;
		},
		clearCategories(state) {
			state.list = [];
		},
	},
});

export const { setCategories, clearCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
