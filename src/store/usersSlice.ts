import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/user";

type UsersState = {
	list: User[];
};

const initialState: UsersState = {
	list: [],
};

const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {
		setUsers(state, action: PayloadAction<User[]>) {
			state.list = action.payload;
		},
		clearUsers(state) {
			state.list = [];
		},
	},
});

export const { setUsers, clearUsers } = usersSlice.actions;
export default usersSlice.reducer;
