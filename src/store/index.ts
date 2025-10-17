import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import authReducer from "./authSlice";
import usersReducer from "./usersSlice";

const rootReducer = combineReducers({ auth: authReducer, users: usersReducer });

export const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
