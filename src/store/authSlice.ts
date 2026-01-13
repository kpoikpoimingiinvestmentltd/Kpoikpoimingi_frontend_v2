import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "@/types/auth";

const initialState: AuthState = {
	id: null,
	accessToken: null,
	refreshToken: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setAuth(state, action: PayloadAction<AuthState>) {
			state.id = action.payload.id ?? state.id;
			state.accessToken = action.payload.accessToken ?? state.accessToken;
			state.refreshToken = action.payload.refreshToken ?? state.refreshToken;
		},
		clearAuth(state) {
			state.id = null;
			state.accessToken = null;
			state.refreshToken = null;
		},
	},
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
